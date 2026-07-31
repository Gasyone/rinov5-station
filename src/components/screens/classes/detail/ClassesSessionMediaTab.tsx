'use client'

import React, { useState, useRef, useMemo } from 'react'
import {
  UploadCloud,
  Film,
  Trash2,
  Download,
  Play,
  FileText,
  Plus,
  Check,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Search,
  Link as LinkIcon,
  ExternalLink,
  Share2,
  Users,
  CalendarDays,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { formatDateWithDay } from './classesSessionDetailHelpers'
import { ConfirmDialog } from '@/components/shared'

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

// ── REUSABLE SINGLE STUDENT SELECTOR POPOVER COMPONENT ──
interface StudentSelectorPopoverContentProps {
  title?: string
  subtitle?: string
  rosterStudents: RosterStudentOption[]
  selectedStudentIds?: string[]
  selectedSingleId?: string
  isFilterMode?: boolean
  showClassWideOption?: boolean
  allCount?: number
  items?: SessionMediaItem[]
  onSelectOption: (id: string | 'all' | 'class_wide') => void
}

function StudentSelectorPopoverContent({
  title = 'Gắn học viên',
  subtitle,
  rosterStudents,
  selectedStudentIds = [],
  selectedSingleId,
  isFilterMode = false,
  showClassWideOption = true,
  allCount = 0,
  items = [],
  onSelectOption,
}: StudentSelectorPopoverContentProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return rosterStudents
    const q = searchQuery.toLowerCase()
    return rosterStudents.filter(
      (st) => st.name.toLowerCase().includes(q) || (st.code && st.code.toLowerCase().includes(q))
    )
  }, [rosterStudents, searchQuery])

  return (
    <div className="w-72 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 text-left">
      {/* Title & Subtitle Header */}
      <div className="pb-2 border-b border-zinc-100 dark:border-zinc-800 space-y-0.5 mb-2">
        <p className="text-xs font-bold text-foreground">{title}</p>
        {subtitle && <p className="text-[11px] text-muted-foreground italic">{subtitle}</p>}
      </div>

      {/* Search Input with Icon */}
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm học viên..."
          className="pl-8 h-8 text-xs rounded-xl border-sky-300 dark:border-sky-700 focus-visible:ring-sky-500 bg-zinc-50/50 dark:bg-zinc-800/40"
        />
      </div>

      {/* Options List */}
      <div className="max-h-56 overflow-y-auto space-y-1 pr-0.5">
        {/* Option: Tất cả tệp (Filter Mode only) */}
        {isFilterMode && (
          <div
            onClick={() => onSelectOption('all')}
            className={cn(
              'flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs font-semibold',
              selectedSingleId === 'all'
                ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">📁</span>
              <span>Tất cả tệp ({allCount})</span>
            </div>
            {selectedSingleId === 'all' && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />}
          </div>
        )}

        {/* Option: Cả lớp */}
        {showClassWideOption && (
          <div
            onClick={() => onSelectOption('class_wide')}
            className={cn(
              'flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs font-semibold',
              isFilterMode
                ? selectedSingleId === 'class_wide'
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
                : selectedStudentIds.length === 0
                ? 'bg-zinc-100 dark:bg-zinc-800 font-bold text-foreground'
                : 'hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground'
            )}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">🌐</span>
              <span>
                Dành cho cả lớp {isFilterMode ? `(${items.filter((i) => i.taggedStudentIds.length === 0).length})` : ''}
              </span>
            </div>
            {((isFilterMode && selectedSingleId === 'class_wide') || (!isFilterMode && selectedStudentIds.length === 0)) && (
              <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />
            )}
          </div>
        )}

        {/* Individual Students */}
        {filtered.map((st) => {
          const isSelected = isFilterMode
            ? selectedSingleId === st.id
            : selectedStudentIds.includes(st.id)
          const bg = st.colorBg || 'bg-amber-100 dark:bg-amber-950/60'
          const text = st.colorText || 'text-amber-800 dark:text-amber-300'
          const count = items.filter((i) => i.taggedStudentIds.includes(st.id)).length

          return (
            <div
              key={st.id}
              onClick={() => onSelectOption(st.id)}
              className={cn(
                'flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors text-xs',
                isSelected
                  ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold'
                  : 'hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground'
              )}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className={`h-7 w-7 rounded-full ${bg} ${text} flex items-center justify-center font-bold text-[11px] shrink-0 border`}>
                  {st.initials || st.name.slice(0, 1)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="truncate block font-semibold text-xs">{st.name}</span>
                  {st.code && <span className="text-[9px] text-muted-foreground font-mono">{st.code}</span>}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {isFilterMode && (
                  <span className="text-[10px] font-mono text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                    {count}
                  </span>
                )}
                {isSelected && <Check className="h-4 w-4 text-sky-600 dark:text-sky-400 stroke-[2.5]" />}
              </div>
            </div>
          )
        })}

        {filtered.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-3 italic">Không tìm thấy học viên</p>
        )}
      </div>
    </div>
  )
}

const INITIAL_MEDIA_ITEMS: SessionMediaItem[] = [
  // ── BUỔI 5 ──
  {
    id: 'm5-1',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Bang_Tu_Vung_Unit4.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=600&auto=format&fit=crop&q=80',
    size: '1.4 MB',
    uploadedBy: 'GV Thu Hà',
    uploadedAt: '17:50 - 09/05',
    taggedStudentIds: [],
  },
  {
    id: 'm5-2',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Hoat_Dong_Nhom_Sticker.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    size: '2.8 MB',
    uploadedBy: 'GV Thu Hà',
    uploadedAt: '18:15 - 09/05',
    taggedStudentIds: ['s1', 's2', 's3', 's4', 's5'],
  },
  {
    id: 'm5-3',
    sessionId: 'ses-5',
    sessionNumber: 5,
    sessionTitle: 'Reading Strategies & Skimming/Scanning',
    sessionDate: '09/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Thuyet_Trinh_Alex.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    size: '14.2 MB',
    duration: '01:20',
    uploadedBy: 'Trợ giảng',
    uploadedAt: '18:40 - 09/05',
    taggedStudentIds: ['s1'],
  },

  // ── BUỔI 4 ──
  {
    id: 'm4-1',
    sessionId: 'ses-4',
    sessionNumber: 4,
    sessionTitle: 'Listening & Pronunciation Practice',
    sessionDate: '07/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Bang_Phien_Am_IPA_Unit3.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=600&auto=format&fit=crop&q=80',
    size: '1.8 MB',
    uploadedBy: 'GV Thu Hà',
    uploadedAt: '18:00 - 07/05',
    taggedStudentIds: ['s2', 's3'],
  },
  {
    id: 'm4-2',
    sessionId: 'ses-4',
    sessionNumber: 4,
    sessionTitle: 'Listening & Pronunciation Practice',
    sessionDate: '07/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Thao_Luan_Phien_Am_Lop.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    size: '18.5 MB',
    duration: '02:15',
    uploadedBy: 'Trợ giảng',
    uploadedAt: '18:50 - 07/05',
    taggedStudentIds: ['s1', 's4'],
  },

  // ── BUỔI 3 ──
  {
    id: 'm3-1',
    sessionId: 'ses-3',
    sessionNumber: 3,
    sessionTitle: 'Grammar in Use & Sentence Building',
    sessionDate: '05/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Tai_Lieu_Song_Ngu_Grammar.pdf',
    type: 'doc',
    url: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    size: '3.2 MB',
    uploadedBy: 'GV Thu Hà',
    uploadedAt: '17:45 - 05/05',
    taggedStudentIds: [],
  },
  {
    id: 'm3-2',
    sessionId: 'ses-3',
    sessionNumber: 3,
    sessionTitle: 'Grammar in Use & Sentence Building',
    sessionDate: '05/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Anh_Kiem_Tra_Dau_Gio.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80',
    size: '1.9 MB',
    uploadedBy: 'GV Thu Hà',
    uploadedAt: '18:20 - 05/05',
    taggedStudentIds: ['s3', 's5'],
  },

  // ── BUỔI 2 ──
  {
    id: 'm2-1',
    sessionId: 'ses-2',
    sessionNumber: 2,
    sessionTitle: 'Speaking Fluency & Everyday Topics',
    sessionDate: '03/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Video_Thuc_Hanh_Hoi_Thoai.mp4',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
    size: '22.1 MB',
    duration: '03:40',
    uploadedBy: 'Trợ giảng',
    uploadedAt: '19:10 - 03/05',
    taggedStudentIds: ['s1', 's2', 's6'],
  },

  // ── BUỔI 1 ──
  {
    id: 'm1-1',
    sessionId: 'ses-1',
    sessionNumber: 1,
    sessionTitle: 'Orientation & Placement Introduction',
    sessionDate: '01/05/2026',
    sessionTime: '18:00 - 19:30',
    name: 'Anh_Khai_Giang_Lop_IELTS.jpg',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    size: '2.5 MB',
    uploadedBy: 'GV Thu Hà',
    uploadedAt: '18:30 - 01/05',
    taggedStudentIds: [],
  },
]

interface ClassesSessionMediaTabProps {
  rosterStudents?: RosterStudentOption[]
  className?: string
}

export function ClassesSessionMediaTab({
  rosterStudents = DEFAULT_ROSTER_STUDENTS,
  className = 'IELTS Junior 1A',
}: ClassesSessionMediaTabProps) {
  const [items, setItems] = useState<SessionMediaItem[]>(INITIAL_MEDIA_ITEMS)
  const [previewItem, setPreviewItem] = useState<SessionMediaItem | null>(null)
  const [activePopoverItemId, setActivePopoverItemId] = useState<string | null>(null)

  // Student filter
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all')

  // Date Range filter
  const [dateFilterPreset, setDateFilterPreset] = useState<string>('all')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  // Selection mode for bulk delete / tag
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [expandedTagItemIds, setExpandedTagItemIds] = useState<string[]>([])
  const [collapsedSessionIds, setCollapsedSessionIds] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const toggleCollapseSession = (sessionId: string) => {
    setCollapsedSessionIds((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
    )
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const newItems: SessionMediaItem[] = Array.from(files).map((file, idx) => {
      const isVid = file.type.startsWith('video/')
      const isImg = file.type.startsWith('image/')
      const objectUrl = URL.createObjectURL(file)
      return {
        id: `upload-${Date.now()}-${idx}`,
        sessionId: 'ses-5',
        sessionNumber: 5,
        sessionTitle: 'Reading Strategies & Skimming/Scanning',
        sessionDate: '09/05/2026',
        sessionTime: '18:00 - 19:30',
        name: file.name,
        type: isVid ? 'video' : isImg ? 'image' : 'doc',
        url: objectUrl,
        thumbnailUrl: isImg ? objectUrl : undefined,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedBy: 'Giáo viên',
        uploadedAt: 'Vừa xong',
        duration: isVid ? '00:45' : undefined,
        taggedStudentIds: [],
      }
    })

    setItems((prev) => [...newItems, ...prev])
    toast.success(`Đã tải lên ${newItems.length} tài liệu/media cho Buổi 5!`)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleShareLink = (item: SessionMediaItem) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(item.url).then(() => {
        toast.success(`Đã sao chép liên kết tệp "${item.name}"!`)
      }).catch(() => {
        toast.success(`Đã sao chép liên kết tệp "${item.name}"!`)
      })
    } else {
      toast.success(`Đã sao chép liên kết tệp "${item.name}"!`)
    }
  }

  const handleDownloadFile = (item: SessionMediaItem) => {
    if (item.isLink) {
      window.open(item.url, '_blank')
      toast.info(`Mở liên kết: ${item.name}`)
      return
    }
    const a = document.createElement('a')
    a.href = item.url
    a.download = item.name
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    toast.success(`Đang tải về tệp: ${item.name}`)
  }

  const handleRemoveStudentTag = (itemId: string, studentId: string, studentName: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            taggedStudentIds: item.taggedStudentIds.filter((id) => id !== studentId),
          }
        }
        return item
      })
    )
    toast.info(`Đã xóa học viên ${studentName}`)
  }

  const handleToggleStudentTagInPopover = (itemId: string, studentId: string | 'all' | 'class_wide') => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          if (studentId === 'class_wide') {
            return { ...item, taggedStudentIds: [] }
          }
          if (studentId === 'all') return item
          const exists = item.taggedStudentIds.includes(studentId)
          const newIds = exists
            ? item.taggedStudentIds.filter((id) => id !== studentId)
            : [...item.taggedStudentIds, studentId]
          return { ...item, taggedStudentIds: newIds }
        }
        return item
      })
    )
  }

  const handleBulkDeleteConfirm = () => {
    if (selectedItemIds.length === 0) return
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmBulkDelete = () => {
    if (selectedItemIds.length === 0) return
    const count = selectedItemIds.length
    setItems((prev) => prev.filter((item) => !selectedItemIds.includes(item.id)))
    toast.success(`Đã xóa thành công ${count} tệp tài liệu/media được chọn!`)
    setSelectedItemIds([])
    setIsDeleteDialogOpen(false)
  }

  const handleBatchTagStudents = (studentId: string | 'all' | 'class_wide') => {
    if (selectedItemIds.length === 0) return
    setItems((prev) =>
      prev.map((item) => {
        if (selectedItemIds.includes(item.id)) {
          if (studentId === 'class_wide') {
            return { ...item, taggedStudentIds: [] }
          }
          if (studentId === 'all') return item
          const exists = item.taggedStudentIds.includes(studentId)
          const newIds = exists
            ? item.taggedStudentIds.filter((id) => id !== studentId)
            : [...item.taggedStudentIds, studentId]
          return { ...item, taggedStudentIds: newIds }
        }
        return item
      })
    )
    const stName = studentId === 'class_wide' ? 'Cả lớp' : rosterStudents.find((s) => s.id === studentId)?.name || 'Học viên'
    toast.success(`Đã cập nhật học viên "${stName}" cho ${selectedItemIds.length} tệp!`)
  }

  const toggleSelectItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  // Label for student filter trigger button
  const selectedStudentFilterLabel = useMemo(() => {
    if (selectedStudentFilter === 'all') return `Tất cả tệp (${items.length})`
    if (selectedStudentFilter === 'class_wide') return `Cả lớp (${items.filter((i) => i.taggedStudentIds.length === 0).length})`
    const found = rosterStudents.find((s) => s.id === selectedStudentFilter)
    if (found) {
      const cnt = items.filter((i) => i.taggedStudentIds.includes(found.id)).length
      return `${found.name} (${cnt})`
    }
    return `Tất cả tệp (${items.length})`
  }, [selectedStudentFilter, items, rosterStudents])

  // Label for date filter trigger button
  const dateFilterLabel = useMemo(() => {
    if (dateFilterPreset === 'all') return 'Tất cả thời gian'
    if (dateFilterPreset === '7days') return '7 ngày qua'
    if (dateFilterPreset === '30days') return '30 ngày qua'
    if (dateFilterPreset === 'this_month') return 'Tháng 5/2026'
    if (dateFilterPreset === 'custom') {
      if (customStartDate && customEndDate) return `${customStartDate} → ${customEndDate}`
      if (customStartDate) return `Từ ${customStartDate}`
      if (customEndDate) return `Đến ${customEndDate}`
      return 'Tùy chọn ngày'
    }
    return 'Thời gian'
  }, [dateFilterPreset, customStartDate, customEndDate])

  // Filtered items for list view (Student filter + Date range filter)
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Student filter
      let matchesStudent = true
      if (selectedStudentFilter === 'class_wide') {
        matchesStudent = item.taggedStudentIds.length === 0
      } else if (selectedStudentFilter !== 'all') {
        matchesStudent = item.taggedStudentIds.includes(selectedStudentFilter)
      }

      if (!matchesStudent) return false

      // 2. Date Range filter
      if (dateFilterPreset === 'all') return true

      const parts = item.sessionDate ? item.sessionDate.split('/') : []
      if (parts.length !== 3) return true

      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      const year = parseInt(parts[2], 10)
      const itemDate = new Date(year, month, day)
      if (isNaN(itemDate.getTime())) return true

      const refDate = new Date(2026, 4, 10) // Reference date May 10, 2026

      if (dateFilterPreset === '7days') {
        const sevenDaysAgo = new Date(refDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        return itemDate >= sevenDaysAgo && itemDate <= refDate
      }
      if (dateFilterPreset === '30days') {
        const thirtyDaysAgo = new Date(refDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        return itemDate >= thirtyDaysAgo && itemDate <= refDate
      }
      if (dateFilterPreset === 'this_month') {
        return itemDate.getFullYear() === 2026 && itemDate.getMonth() === 4
      }
      if (dateFilterPreset === 'custom') {
        if (customStartDate) {
          const start = new Date(customStartDate)
          if (!isNaN(start.getTime()) && itemDate < start) return false
        }
        if (customEndDate) {
          const end = new Date(customEndDate)
          if (!isNaN(end.getTime()) && itemDate > end) return false
        }
        return true
      }

      return true
    })
  }, [items, selectedStudentFilter, dateFilterPreset, customStartDate, customEndDate])

  // Group items by Session
  const groupedSessions = useMemo(() => {
    const map = new Map<string, {
      sessionId: string
      sessionNumber: number
      sessionTitle: string
      sessionDate: string
      sessionTime: string
      items: SessionMediaItem[]
    }>()

    filteredItems.forEach((item) => {
      const key = item.sessionId || `ses-${item.sessionNumber || 1}`
      if (!map.has(key)) {
        map.set(key, {
          sessionId: key,
          sessionNumber: item.sessionNumber || 1,
          sessionTitle: item.sessionTitle || 'Nội dung buổi học',
          sessionDate: item.sessionDate || '09/05/2026',
          sessionTime: item.sessionTime || '18:00 - 19:30',
          items: [],
        })
      }
      map.get(key)!.items.push(item)
    })

    return Array.from(map.values()).sort((a, b) => b.sessionNumber - a.sessionNumber)
  }, [filteredItems])

  const isAllSelected = filteredItems.length > 0 && filteredItems.every((i) => selectedItemIds.includes(i.id))

  return (
    <div className="space-y-2">
      {/* ── UNIFIED TOOLBAR ROW: CHECKBOX + FILTERS (LEFT) + ACTIONS (RIGHT) ── */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 py-1">
        {/* Left: Checkbox Select All + Filters (Student & Date Range) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground font-medium shrink-0">
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedItemIds(filteredItems.map((i) => i.id))
              } else {
                setSelectedItemIds([])
              }
            }}
            title="Chọn tất cả"
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 shadow-2xs"
          />

          <span className="font-bold text-foreground me-1">Lọc:</span>

          {/* 1. STUDENT FILTER POPOVER (Standard reusable component) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-8 px-2.5 text-xs font-semibold border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl gap-1.5 shadow-2xs cursor-pointer text-foreground"
              >
                <Users className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                <span className="truncate max-w-[150px]">{selectedStudentFilterLabel}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0 border-0 bg-transparent shadow-none z-[9999]">
              <StudentSelectorPopoverContent
                title="Lọc theo học viên"
                rosterStudents={rosterStudents}
                selectedSingleId={selectedStudentFilter}
                isFilterMode={true}
                allCount={items.length}
                items={items}
                onSelectOption={(id) => setSelectedStudentFilter(id)}
              />
            </PopoverContent>
          </Popover>

          {/* 2. DATE RANGE FILTER POPOVER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="xs"
                className="h-8 px-2.5 text-xs font-semibold border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-xl gap-1.5 shadow-2xs cursor-pointer text-foreground"
              >
                <CalendarDays className="h-3.5 w-3.5 text-sky-600 dark:text-sky-400" />
                <span className="truncate max-w-[150px]">{dateFilterLabel}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-72 p-3 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 z-[9999] space-y-2.5 text-left">
              <div className="text-xs font-bold text-foreground pb-1.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span>Khoảng thời gian</span>
                {dateFilterPreset !== 'all' && (
                  <button
                    type="button"
                    onClick={() => {
                      setDateFilterPreset('all')
                      setCustomStartDate('')
                      setCustomEndDate('')
                    }}
                    className="text-[10px] text-sky-600 hover:underline font-normal cursor-pointer"
                  >
                    Đặt lại
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-1 text-xs">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: '7days', label: '7 ngày qua' },
                  { id: '30days', label: '30 ngày qua' },
                  { id: 'this_month', label: 'Tháng 5/2026' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDateFilterPreset(p.id)}
                    className={cn(
                      "px-2 py-1.5 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer",
                      dateFilterPreset === p.id
                        ? "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800"
                        : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                <span className="text-[11px] font-semibold text-muted-foreground block">Tùy chọn ngày:</span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">Từ ngày</label>
                    <Input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => {
                        setCustomStartDate(e.target.value)
                        setDateFilterPreset('custom')
                      }}
                      className="h-7 text-xs bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-0.5">Đến ngày</label>
                    <Input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => {
                        setCustomEndDate(e.target.value)
                        setDateFilterPreset('custom')
                      }}
                      className="h-7 text-xs bg-zinc-50 dark:bg-zinc-800/50 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Hidden file input for uploads */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Right: Dynamic Actions (Xóa, Gắn HV appear ONLY when items checked) + Tải lên */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Show Xóa & Gắn HV ONLY when 1 or more items are checked */}
          {selectedItemIds.length > 0 && (
            <div className="flex items-center gap-1.5 animate-fade-in">
              {/* Button Xóa */}
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleBulkDeleteConfirm}
                className="h-7 px-3 text-xs font-bold border-zinc-300 dark:border-zinc-700 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-rose-600 hover:border-rose-400 dark:hover:border-rose-600 rounded-lg cursor-pointer transition-all shadow-2xs"
              >
                Xóa
              </Button>

              {/* Button Gắn HV (BULK TAG POPOVER using standard component) */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    className="h-7 px-3 text-xs font-bold border-sky-400 dark:border-sky-600 bg-transparent text-[#0284c7] dark:text-sky-400 hover:bg-white dark:hover:bg-zinc-900 hover:text-sky-700 hover:border-sky-500 rounded-lg cursor-pointer transition-all shadow-2xs"
                  >
                    Gắn HV
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="p-0 border-0 bg-transparent shadow-none z-[9999]">
                  <StudentSelectorPopoverContent
                    title={`Gắn học viên cho ${selectedItemIds.length} tệp đã chọn`}
                    subtitle={`Danh sách thuộc lớp ${className}`}
                    rosterStudents={rosterStudents}
                    showClassWideOption={true}
                    onSelectOption={(id) => handleBatchTagStudents(id)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          {/* Button Tải lên */}
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => fileInputRef.current?.click()}
            className="h-7 px-2.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/60 rounded-lg cursor-pointer transition-colors gap-1"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Tải lên</span>
          </Button>
        </div>
      </div>

      {/* ── SESSION GROUPED MEDIA LISTING ── */}
      {groupedSessions.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <Film className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm font-semibold text-foreground">Không tìm thấy tài liệu hay media phù hợp</p>
          <p className="text-xs text-muted-foreground mt-0.5">Vui lòng thay đổi bộ lọc học viên hoặc khoảng thời gian.</p>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          {groupedSessions.map((group) => {
            const isCollapsed = collapsedSessionIds.includes(group.sessionId)

            return (
              <div key={group.sessionId} className="space-y-2">
                {/* Collapsible Session Header Card (Matching screenshot styling) */}
                <div
                  onClick={() => toggleCollapseSession(group.sessionId)}
                  className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 border-s-4 border-s-amber-500 bg-white dark:bg-zinc-900/90 shadow-2xs cursor-pointer hover:bg-zinc-50/80 dark:hover:bg-zinc-850 transition-colors"
                >
                  {/* Left: Session Number & Topic */}
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-foreground">
                    <span>Buổi {group.sessionNumber}: {group.sessionTitle}</span>
                    <Badge variant="outline" className="text-[10px] font-mono px-1.5 py-0 border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-muted-foreground">
                      {group.items.length} tệp
                    </Badge>
                  </div>

                  {/* Right: Date & Time + Chevron Toggle */}
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span className="font-mono text-[11px] sm:text-xs">{formatDateWithDay(group.sessionDate)} ({group.sessionTime})</span>
                    {isCollapsed ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    ) : (
                      <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground/70" />
                    )}
                  </div>
                </div>

                {/* Session Media Grid (Hidden when collapsed) */}
                {!isCollapsed && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {group.items.map((item) => {
                      const taggedNames = rosterStudents.filter((st) => item.taggedStudentIds.includes(st.id))
                      const isSelected = selectedItemIds.includes(item.id)

                      return (
                        <div
                          key={item.id}
                          className={cn(
                            'group/card relative rounded-2xl border overflow-hidden transition-all bg-zinc-900 dark:bg-zinc-950 text-white shadow-sm hover:shadow-md',
                            isSelected
                              ? 'border-sky-500 ring-2 ring-sky-500/30'
                              : 'border-zinc-800 hover:border-zinc-700'
                          )}
                        >
                          {/* Image/Video Media Box */}
                          <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
                            {item.type === 'image' || item.thumbnailUrl ? (
                              <img
                                src={item.thumbnailUrl || item.url}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                              />
                            ) : item.type === 'video' ? (
                              <div className="relative h-full w-full bg-zinc-900 flex items-center justify-center">
                                {item.thumbnailUrl ? (
                                  <img src={item.thumbnailUrl} alt={item.name} className="h-full w-full object-cover opacity-80" />
                                ) : (
                                  <Film className="h-12 w-12 text-zinc-600" />
                                )}
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                  <div className="h-10 w-10 rounded-full bg-black/60 backdrop-blur-xs flex items-center justify-center text-white border border-white/20">
                                    <Play className="h-5 w-5 fill-white ml-0.5" />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 text-center">
                                <FileText className="h-10 w-10 mx-auto text-sky-400 mb-1" />
                                <span className="text-xs font-semibold text-zinc-300 block truncate">{item.name}</span>
                              </div>
                            )}

                             {/* Top Overlay: Checkbox + File Name (Left) & Type Badge (Right) */}
                            <div className="absolute inset-x-0 top-0 p-2.5 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between gap-2 z-30 pointer-events-none">
                              {/* Left: Checkbox + File Name (Only shows on hover or when selected) */}
                              <div
                                className={cn(
                                  'flex items-center gap-2 min-w-0 pointer-events-auto transition-opacity duration-200',
                                  isSelected ? 'opacity-100' : 'opacity-0 group-hover/card:opacity-100'
                                )}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSelectItem(item.id)}
                                  className="h-5 w-5 rounded-md bg-white border-white text-zinc-900 shadow-md hover:bg-zinc-100 data-[state=checked]:bg-sky-500 data-[state=checked]:border-sky-500 data-[state=checked]:text-white cursor-pointer transition-transform hover:scale-110 shrink-0"
                                />
                                <span
                                  className="font-bold text-xs text-white truncate drop-shadow-sm pointer-events-auto"
                                  title={item.name}
                                >
                                  {item.name}
                                </span>
                              </div>

                              {/* Right: Type Badge */}
                              <div className="shrink-0 pointer-events-auto">
                                <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-[10px] font-bold text-zinc-200 border border-white/10 uppercase tracking-wider">
                                  {item.type === 'image' ? 'Ảnh' : item.type === 'video' ? 'Video' : 'Tệp'}
                                </span>
                              </div>
                            </div>

                            {/* Hover Overlay with Action Buttons */}
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-2 z-20">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleShareLink(item)
                                  }}
                                  className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                                  title="Chia sẻ (Copy link)"
                                >
                                  <Share2 className="h-4.5 w-4.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleDownloadFile(item)
                                  }}
                                  className="h-9 w-9 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                                  title="Tải về"
                                >
                                  <Download className="h-4.5 w-4.5" />
                                </button>
                              </div>

                              {/* 3. INDIVIDUAL CARD TAGGING POPOVER (Standard reusable component) */}
                              <Popover
                                open={activePopoverItemId === item.id}
                                onOpenChange={(open) => {
                                  if (open) {
                                    setActivePopoverItemId(item.id)
                                  } else {
                                    setActivePopoverItemId(null)
                                  }
                                }}
                              >
                                <PopoverTrigger asChild>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setActivePopoverItemId(item.id)
                                    }}
                                    className="px-4 py-1.5 rounded-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center gap-1"
                                  >
                                    <span>Thêm</span>
                                  </button>
                                </PopoverTrigger>

                                <PopoverContent
                                  align="center"
                                  side="bottom"
                                  sideOffset={5}
                                  className="p-0 border-0 bg-transparent shadow-none z-[9999]"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <StudentSelectorPopoverContent
                                    title="Gắn học viên"
                                    subtitle={`Danh sách thuộc lớp ${className}`}
                                    rosterStudents={rosterStudents}
                                    selectedStudentIds={item.taggedStudentIds}
                                    showClassWideOption={true}
                                    onSelectOption={(id) => handleToggleStudentTagInPopover(item.id, id)}
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            {/* Bottom Overlay: Tagged Avatars Only */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2.5 pt-6 flex flex-col gap-1 z-10 pointer-events-none">

                              {/* Tagged Student Avatar Circles */}
                              {item.taggedStudentIds.length === 0 ? (
                                <div className="flex items-center gap-1 text-[10px] text-zinc-300 font-medium">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                  <span>Dành cho cả lớp</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 flex-wrap pointer-events-auto">
                                  {taggedNames.map((st) => {
                                    const bg = st.colorBg || 'bg-amber-100 dark:bg-amber-950/60'
                                    const text = st.colorText || 'text-amber-800 dark:text-amber-300'
                                    return (
                                      <div
                                        key={st.id}
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRemoveStudentTag(item.id, st.id, st.name)
                                        }}
                                        className={`group/avatar relative flex items-center justify-center h-6 w-6 rounded-full ${bg} ${text} text-[10px] font-bold border shadow-xs transition-transform hover:scale-110 cursor-pointer`}
                                        title={`${st.name} (Nhấp để xóa học viên)`}
                                      >
                                        <span>{st.initials || st.name.slice(0, 1).toUpperCase()}</span>
                                        <span className="absolute inset-0 rounded-full bg-rose-600 text-white opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity">
                                          <X className="h-3 w-3 stroke-[3]" />
                                        </span>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── LIGHTBOX / MEDIA PREVIEW DIALOG ── */}
      {previewItem && (
        <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
          <DialogContent className="max-w-3xl p-4 bg-zinc-950 border-zinc-800 text-white rounded-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-3">
              <div className="min-w-0 pr-4">
                <DialogTitle className="font-bold text-sm truncate text-white">{previewItem.name}</DialogTitle>
                <p className="text-xs text-zinc-400">
                  {previewItem.size} • Tải lên bởi {previewItem.uploadedBy} ({previewItem.uploadedAt})
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => handleShareLink(previewItem)}
                  className="gap-1.5 rounded-lg text-xs font-semibold border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white cursor-pointer"
                  title="Chia sẻ link (Sao chép liên kết)"
                >
                  <Share2 className="h-3.5 w-3.5 text-sky-400" />
                  <span>Chia sẻ link</span>
                </Button>
                <button
                  type="button"
                  onClick={() => handleDownloadFile(previewItem)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors cursor-pointer"
                  title="Tải về tệp"
                >
                  {previewItem.isLink ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                  <span>{previewItem.isLink ? 'Mở liên kết' : 'Tải về tệp'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[300px] max-h-[70vh] overflow-hidden rounded-xl bg-black">
              {previewItem.type === 'image' || previewItem.thumbnailUrl ? (
                <img
                  src={previewItem.thumbnailUrl || previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[70vh] w-auto object-contain rounded-lg"
                />
              ) : previewItem.type === 'video' ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  className="max-h-[70vh] w-full rounded-lg"
                />
              ) : (
                <div className="p-8 text-center text-zinc-400">
                  <FileText className="h-12 w-12 mx-auto mb-2 text-sky-400" />
                  <p>Không có bản xem trực tiếp cho tệp tài liệu này.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ── DELETION CONFIRMATION DIALOG (Per DS Safety Rules) ── */}
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Xác nhận xóa tệp tài liệu/media?"
        description={`Bạn có chắc chắn muốn xóa ${selectedItemIds.length} tệp tài liệu/media đã chọn không? Thao tác này không thể hoàn tác.`}
        confirmLabel="Xóa tệp"
        cancelLabel="Hủy"
        variant="destructive"
        onConfirm={handleConfirmBulkDelete}
      />
    </div>
  )
}
