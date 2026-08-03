'use client'

import React, { useState, useRef, useMemo } from 'react'
import {
  Film,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatDateWithDay, splitDateWithDay } from './classesSessionDetailHelpers'
import { ConfirmDialog, PersonnelHoverCard } from '@/components/shared'

import {
  RosterStudentOption,
  DEFAULT_ROSTER_STUDENTS,
  SessionMediaItem,
  SessionMediaTeacher,
} from './media/classesSessionMediaTypes'
import { ClassesSessionMediaCard } from './media/ClassesSessionMediaCard'
import { ClassesSessionMediaToolbar } from './media/ClassesSessionMediaToolbar'

export type { RosterStudentOption, SessionMediaItem }
export { DEFAULT_ROSTER_STUDENTS }

const INITIAL_MOCK_MEDIA: SessionMediaItem[] = [
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
]

interface ClassesSessionMediaTabProps {
  className?: string
  rosterStudents?: RosterStudentOption[]
  sessionId?: string
  sessionNumber?: number
  singleSessionMode?: boolean
}

export function ClassesSessionMediaTab({
  className = 'IELTS Junior 1A',
  rosterStudents = DEFAULT_ROSTER_STUDENTS,
  sessionId,
  sessionNumber,
  singleSessionMode = false,
}: ClassesSessionMediaTabProps) {
  const [items, setItems] = useState<SessionMediaItem[]>(INITIAL_MOCK_MEDIA)
  const [activePopoverItemId, setActivePopoverItemId] = useState<string | null>(null)
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all')

  const [dateFilterPreset, setDateFilterPreset] = useState<string>('all')
  const [customStartDate, setCustomStartDate] = useState<string>('')
  const [customEndDate, setCustomEndDate] = useState<string>('')

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const targetSessionId = sessionId || 'ses-5'
    const targetSessionNum = sessionNumber || 5

    const newItems: SessionMediaItem[] = Array.from(files).map((file, idx) => {
      const objectUrl = URL.createObjectURL(file)
      const isImg = file.type.startsWith('image/')
      const isVid = file.type.startsWith('video/')
      return {
        id: `upload-${Date.now()}-${idx}`,
        sessionId: targetSessionId,
        sessionNumber: targetSessionNum,
        sessionTitle: 'Nội dung buổi học',
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
    toast.success(`Đã tải lên ${newItems.length} tài liệu/media!`)
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
          const newIds = exists ? item.taggedStudentIds : [...item.taggedStudentIds, studentId]
          return { ...item, taggedStudentIds: newIds }
        }
        return item
      })
    )
    const label = studentId === 'class_wide' ? 'Cả lớp' : rosterStudents.find((s) => s.id === studentId)?.name || 'Học viên'
    toast.success(`Đã gắn "${label}" cho ${selectedItemIds.length} tệp được chọn!`)
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // In singleSessionMode, strictly filter to current session items only
      if (singleSessionMode || sessionId || sessionNumber !== undefined) {
        const matchesSession =
          (sessionId && item.sessionId === sessionId) ||
          (sessionNumber !== undefined && item.sessionNumber === sessionNumber)

        if (!matchesSession) return false
      }

      if (selectedStudentFilter === 'class_wide') {
        if (item.taggedStudentIds.length !== 0) return false
      } else if (selectedStudentFilter !== 'all') {
        if (!item.taggedStudentIds.includes(selectedStudentFilter)) return false
      }

      if (dateFilterPreset === '7days') {
        if (item.sessionNumber < 4) return false
      } else if (dateFilterPreset === '30days' || dateFilterPreset === 'this_month') {
        return true
      } else if (dateFilterPreset === 'custom') {
        if (customStartDate && item.sessionDate < customStartDate) return false
        if (customEndDate && item.sessionDate > customEndDate) return false
      }

      return true
    })
  }, [items, singleSessionMode, sessionId, sessionNumber, selectedStudentFilter, dateFilterPreset, customStartDate, customEndDate])

  const selectedStudentFilterLabel = useMemo(() => {
    if (selectedStudentFilter === 'all') return `Tất cả tệp (${items.length})`
    if (selectedStudentFilter === 'class_wide') return 'Dành cho cả lớp'
    const found = rosterStudents.find((st) => st.id === selectedStudentFilter)
    return found ? found.name : 'Đã chọn học viên'
  }, [selectedStudentFilter, items, rosterStudents])

  const dateFilterLabel = useMemo(() => {
    if (dateFilterPreset === 'all') return 'Tất cả thời gian'
    if (dateFilterPreset === '7days') return '7 ngày qua'
    if (dateFilterPreset === '30days') return '30 ngày qua'
    if (dateFilterPreset === 'this_month') return 'Tháng 5/2026'
    if (dateFilterPreset === 'custom') {
      if (customStartDate && customEndDate) return `${customStartDate} -> ${customEndDate}`
      if (customStartDate) return `Từ ${customStartDate}`
      if (customEndDate) return `Đến ${customEndDate}`
      return 'Tùy chọn ngày'
    }
    return 'Khoảng thời gian'
  }, [dateFilterPreset, customStartDate, customEndDate])

  const DEFAULT_TEACHER: SessionMediaTeacher = {
    id: 't1',
    name: 'Hoàng Thị Mai',
    code: 'EMP-HTM',
    role: 'Giáo viên chính',
    phone: '0901234567',
    email: 'hongthmai@rinoedu.com',
  }

  const groupedSessions = useMemo(() => {
    const map = new Map<string, {
      sessionId: string
      sessionNumber: number
      sessionTitle: string
      sessionDate: string
      sessionTime: string
      teacher: SessionMediaTeacher
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
          teacher: item.teacher || DEFAULT_TEACHER,
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
      {/* ── UNIFIED TOOLBAR ROW ── */}
      <ClassesSessionMediaToolbar
        isAllSelected={isAllSelected}
        filteredItems={filteredItems}
        selectedItemIds={selectedItemIds}
        setSelectedItemIds={setSelectedItemIds}
        selectedStudentFilter={selectedStudentFilter}
        setSelectedStudentFilter={setSelectedStudentFilter}
        selectedStudentFilterLabel={selectedStudentFilterLabel}
        rosterStudents={rosterStudents}
        items={items}
        dateFilterPreset={dateFilterPreset}
        setDateFilterPreset={setDateFilterPreset}
        dateFilterLabel={dateFilterLabel}
        customStartDate={customStartDate}
        setCustomStartDate={setCustomStartDate}
        customEndDate={customEndDate}
        setCustomEndDate={setCustomEndDate}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleBulkDeleteConfirm={handleBulkDeleteConfirm}
        handleBatchTagStudents={handleBatchTagStudents}
        className={className}
      />

      {/* ── MEDIA LISTING ── */}
      {filteredItems.length === 0 ? (
        <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/30">
          <Film className="h-10 w-10 mx-auto text-zinc-300 dark:text-zinc-700 mb-2" />
          <p className="text-sm font-semibold text-foreground">Không tìm thấy tài liệu hay media phù hợp</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {singleSessionMode
              ? 'Chưa có tệp nào cho buổi học này. Nhấp "+ Tải lên" để tải tệp mới.'
              : 'Vui lòng thay đổi bộ lọc học viên hoặc khoảng thời gian.'}
          </p>
        </div>
      ) : singleSessionMode ? (
        /* Single Session Mode: Direct Grid without session group header label */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {filteredItems.map((item) => (
            <ClassesSessionMediaCard
              key={item.id}
              item={item}
              isSelected={selectedItemIds.includes(item.id)}
              className={className}
              rosterStudents={rosterStudents}
              activePopoverItemId={activePopoverItemId}
              setActivePopoverItemId={setActivePopoverItemId}
              toggleSelectItem={toggleSelectItem}
              handleShareLink={handleShareLink}
              handleDownloadFile={handleDownloadFile}
              handleRemoveStudentTag={handleRemoveStudentTag}
              handleToggleStudentTagInPopover={handleToggleStudentTagInPopover}
            />
          ))}
        </div>
      ) : (
        /* Multi-session (Class Detail) Mode: Grouped by session with headers */
        <div className="space-y-6 pt-1">
          {groupedSessions.map((group) => {
            return (
              <div key={group.sessionId} className="space-y-2.5">
                {/* Session Group Header (Flat title + date/time inline) */}
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">
                    Buổi {group.sessionNumber}: {group.sessionTitle}
                  </h3>
                  <span className="text-xs font-normal text-muted-foreground flex items-center gap-1.5 flex-wrap">
                    <span>
                      {(() => {
                        const dInfo = splitDateWithDay(group.sessionDate)
                        return dInfo ? (
                          <>
                            {dInfo.dayOfWeek && <strong className="font-bold text-foreground me-1">{dInfo.dayOfWeek},</strong>}
                            {dInfo.dateRest}
                          </>
                        ) : (
                          formatDateWithDay(group.sessionDate)
                        )
                      })()} ({group.sessionTime})
                    </span>
                    <span className="text-muted-foreground/40">•</span>
                    <span className="text-muted-foreground font-normal">GV:</span>
                    <PersonnelHoverCard
                      person={{
                        id: group.teacher.code || 'EMP-HTM',
                        name: group.teacher.name,
                        role: group.teacher.role || 'Giáo viên chính',
                        phone: group.teacher.phone || '0901234567',
                        email: group.teacher.email || 'hongthmai@rinoedu.com',
                      }}
                      align="start"
                    >
                      <span className="text-xs font-normal text-foreground cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 hover:underline hover:underline-offset-2 transition-colors">
                        {group.teacher.name}
                      </span>
                    </PersonnelHoverCard>
                  </span>
                </div>

                {/* Session Media Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {group.items.map((item) => (
                    <ClassesSessionMediaCard
                      key={item.id}
                      item={item}
                      isSelected={selectedItemIds.includes(item.id)}
                      className={className}
                      rosterStudents={rosterStudents}
                      activePopoverItemId={activePopoverItemId}
                      setActivePopoverItemId={setActivePopoverItemId}
                      toggleSelectItem={toggleSelectItem}
                      handleShareLink={handleShareLink}
                      handleDownloadFile={handleDownloadFile}
                      handleRemoveStudentTag={handleRemoveStudentTag}
                      handleToggleStudentTagInPopover={handleToggleStudentTagInPopover}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── DELETION CONFIRMATION DIALOG ── */}
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
