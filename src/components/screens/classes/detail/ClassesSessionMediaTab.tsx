'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import { toast } from 'sonner'
import { formatDateWithDay, splitDateWithDay } from './classesSessionDetailHelpers'
import { ConfirmDialog, PersonnelHoverCard, MediaPreviewModal, type MediaPreviewItem, type TaggedStudentItem } from '@/components/shared'

import {
  RosterStudentOption,
  DEFAULT_ROSTER_STUDENTS,
  SessionMediaItem,
  SessionMediaTeacher,
  UploadingMediaItem,
  MAX_FILES_PER_UPLOAD,
  INITIAL_MOCK_MEDIA,
  INITIAL_DEMO_UPLOADING,
} from './media/classesSessionMediaTypes'
import { ClassesSessionMediaCard } from './media/ClassesSessionMediaCard'
import { ClassesSessionMediaToolbar } from './media/ClassesSessionMediaToolbar'
import { ClassesSessionUploadingCard } from './media/ClassesSessionUploadingCard'
import { ClassesSessionMediaEmptyState } from './media/ClassesSessionMediaEmptyState'
import { generateInitialSessionMedia, createUploadMediaItems } from './media/classesSessionMediaHelpers'

export type { RosterStudentOption, SessionMediaItem }
export { DEFAULT_ROSTER_STUDENTS, INITIAL_MOCK_MEDIA, INITIAL_DEMO_UPLOADING }

const DEFAULT_TEACHER: SessionMediaTeacher = {
  id: 't1',
  name: 'Hoàng Thị Mai',
  code: 'EMP-HTM',
  role: 'Giáo viên chính',
  phone: '0901234567',
  email: 'hongthmai@rinoedu.com',
}

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
  const [items, setItems] = useState<SessionMediaItem[]>(() => {
    if (singleSessionMode && sessionNumber !== undefined) {
      const hasCurrent = INITIAL_MOCK_MEDIA.some(
        (item) => item.sessionNumber === sessionNumber || (sessionId && item.sessionId === sessionId)
      )
      if (!hasCurrent) {
        return [...INITIAL_MOCK_MEDIA, ...generateInitialSessionMedia(sessionNumber, sessionId, rosterStudents)]
      }
    }
    return INITIAL_MOCK_MEDIA
  })
  const [activePopoverItemId, setActivePopoverItemId] = useState<string | null>(null)
  const [selectedStudentFilter, setSelectedStudentFilter] = useState<string>('all')
  const [previewMedia, setPreviewMedia] = useState<MediaPreviewItem | null>(null)

  const [uploadingItems, setUploadingItems] = useState<UploadingMediaItem[]>(INITIAL_DEMO_UPLOADING)
  const uploadTimersRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePreviewItem = (item: SessionMediaItem) => {
    if (item.type === 'doc') {
      if (item.url && item.url !== '#') {
        window.open(item.url, '_blank')
        toast.success(`Đang mở tài liệu: ${item.name}`)
      } else {
        handleDownloadFile(item)
      }
      return
    }

    const taggedStudents: TaggedStudentItem[] =
      item.taggedStudentIds.length === 0
        ? []
        : rosterStudents
            .filter((st) => item.taggedStudentIds.includes(st.id))
            .map((st) => ({
              id: st.id,
              name: st.name,
              avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(st.name)}`,
            }))

    setPreviewMedia({
      name: item.name,
      url: item.url,
      type: item.type,
      thumbnailUrl: item.thumbnailUrl || item.url,
      taggedStudents,
      duration: item.duration,
      size: item.size,
    })
  }

  // Start initial demo upload ticker & cleanup timers on unmount
  useEffect(() => {
    // Demo item ticker running slowly (1% per 1.2s)
    const demoItem = uploadingItems.find((u) => u.id === 'upload-demo-in-progress')
    if (demoItem) {
      const demoTimer = setInterval(() => {
        setUploadingItems((prev) => {
          const current = prev.find((u) => u.id === 'upload-demo-in-progress')
          if (!current) {
            clearInterval(demoTimer)
            return prev
          }
          const nextProgress = current.progress + 1
          const nextLoadedBytes = Math.round((nextProgress / 100) * current.totalBytes)
          if (nextProgress >= 100) {
            clearInterval(demoTimer)
            uploadTimersRef.current.delete('upload-demo-in-progress')
            const completedDemoId = `m-demo-${Date.now()}`
            const completedDemo: SessionMediaItem = {
              id: completedDemoId,
              sessionId: current.sessionId,
              sessionNumber: current.sessionNumber,
              sessionTitle: current.sessionTitle,
              sessionDate: current.sessionDate,
              sessionTime: current.sessionTime,
              name: current.name,
              type: 'video',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
              size: current.size,
              uploadedBy: 'Giáo viên',
              uploadedAt: 'Vừa xong',
              duration: '02:15',
              taggedStudentIds: [],
            }
            setItems((prev) => {
              if (prev.some((item) => item.id === completedDemoId || item.id === 'm-demo-finished' || item.name === current.name)) {
                return prev
              }
              return [completedDemo, ...prev]
            })
            toast.success(`Đã tải lên thành công: ${current.name}!`)
            return prev.filter((u) => u.id !== current.id)
          }
          return prev.map((u) =>
            u.id === current.id
              ? { ...u, progress: nextProgress, loadedBytes: nextLoadedBytes }
              : u
          )
        })
      }, 1200)

      uploadTimersRef.current.set('upload-demo-in-progress', demoTimer)
    }

    return () => {
      uploadTimersRef.current.forEach((timer) => clearInterval(timer))
      uploadTimersRef.current.clear()
    }
  }, [])

  const handleCancelUpload = (uploadId: string) => {
    const timer = uploadTimersRef.current.get(uploadId)
    if (timer) {
      clearInterval(timer)
      uploadTimersRef.current.delete(uploadId)
    }
    setUploadingItems((prev) => {
      const target = prev.find((u) => u.id === uploadId)
      if (target) {
        toast.info(`Đã hủy tải lên tệp: ${target.name}`)
      }
      return prev.filter((u) => u.id !== uploadId)
    })
  }

  const processFiles = (files: File[]) => {
    if (!files || files.length === 0) return

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    if (files.length > MAX_FILES_PER_UPLOAD) {
      toast.error(`Mỗi lượt tải lên cho phép tối đa ${MAX_FILES_PER_UPLOAD} tệp. Vui lòng chọn lại!`)
      return
    }

    const targetSessionId = sessionId || (sessionNumber !== undefined ? `ses-${sessionNumber}` : 'ses-5')
    const targetSessionNum = sessionNumber !== undefined ? sessionNumber : 5

    const validNewUploads = createUploadMediaItems(files, targetSessionId, targetSessionNum)
    if (validNewUploads.length === 0) return

    setUploadingItems((prev) => [...validNewUploads, ...prev])

    validNewUploads.forEach((uploadItem) => {
      const stepIncrement = 2
      const intervalMs = 800

      const timer = setInterval(() => {
        setUploadingItems((prev) => {
          const current = prev.find((u) => u.id === uploadItem.id)
          if (!current) {
            clearInterval(timer)
            uploadTimersRef.current.delete(uploadItem.id)
            return prev
          }

          const nextProgress = Math.min(100, current.progress + stepIncrement)
          const nextLoadedBytes = Math.min(current.totalBytes, Math.round((nextProgress / 100) * current.totalBytes))

          if (nextProgress >= 100) {
            clearInterval(timer)
            uploadTimersRef.current.delete(uploadItem.id)

            const objectUrl = uploadItem.rawFile
              ? URL.createObjectURL(uploadItem.rawFile)
              : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            const completedItem: SessionMediaItem = {
              id: uploadItem.id,
              sessionId: uploadItem.sessionId,
              sessionNumber: uploadItem.sessionNumber,
              sessionTitle: uploadItem.sessionTitle,
              sessionDate: uploadItem.sessionDate,
              sessionTime: uploadItem.sessionTime,
              name: uploadItem.name,
              type: uploadItem.type,
              url: objectUrl,
              thumbnailUrl: uploadItem.type === 'image' ? objectUrl : undefined,
              size: uploadItem.size,
              uploadedBy: 'Giáo viên',
              uploadedAt: 'Vừa xong',
              duration: uploadItem.type === 'video' ? '00:45' : undefined,
              taggedStudentIds: [],
            }

            setItems((prevItems) => {
              if (prevItems.some((item) => item.id === completedItem.id)) {
                return prevItems
              }
              return [completedItem, ...prevItems]
            })
            toast.success(`Đã tải lên thành công: ${uploadItem.name}!`)

            return prev.filter((u) => u.id !== uploadItem.id)
          }

          return prev.map((u) =>
            u.id === uploadItem.id ? { ...u, progress: nextProgress, loadedBytes: nextLoadedBytes } : u
          )
        })
      }, intervalMs)

      uploadTimersRef.current.set(uploadItem.id, timer)
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    processFiles(Array.from(e.target.files))
  }

  const handleDropFiles = (files: FileList) => {
    processFiles(Array.from(files))
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

    const selectedTargetItems = items.filter((item) => selectedItemIds.includes(item.id))
    const totalSelected = selectedTargetItems.length

    if (studentId === 'class_wide') {
      const allClassWide = selectedTargetItems.every((i) => i.taggedStudentIds.length === 0)
      if (allClassWide) {
        toast.info('Tất cả các tệp được chọn đã ở trạng thái Dành cho cả lớp')
        return
      }
      setItems((prev) =>
        prev.map((item) => {
          if (selectedItemIds.includes(item.id)) {
            return { ...item, taggedStudentIds: [] }
          }
          return item
        })
      )
      toast.success(`Đã chuyển ${totalSelected} tệp sang "Dành cho cả lớp"!`)
      return
    }

    if (studentId === 'all') return

    // If ALL selected items already have this student -> toggle OFF (remove)
    // If SOME or NONE have this student -> toggle ON (add to all)
    const allHaveStudent = selectedTargetItems.every((i) => i.taggedStudentIds.includes(studentId))
    const stName = rosterStudents.find((s) => s.id === studentId)?.name || 'Học viên'

    if (allHaveStudent) {
      setItems((prev) =>
        prev.map((item) => {
          if (selectedItemIds.includes(item.id)) {
            return {
              ...item,
              taggedStudentIds: item.taggedStudentIds.filter((id) => id !== studentId),
            }
          }
          return item
        })
      )
      toast.info(`Đã gỡ "${stName}" khỏi ${totalSelected} tệp được chọn!`)
    } else {
      setItems((prev) =>
        prev.map((item) => {
          if (selectedItemIds.includes(item.id)) {
            const exists = item.taggedStudentIds.includes(studentId)
            return {
              ...item,
              taggedStudentIds: exists ? item.taggedStudentIds : [...item.taggedStudentIds, studentId],
            }
          }
          return item
        })
      )
      toast.success(`Đã gắn "${stName}" cho ${totalSelected} tệp được chọn!`)
    }
  }

  const toggleSelectItem = (itemId: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  // Current session all items (without student filter)
  const currentSessionItems = useMemo(() => {
    if (!singleSessionMode && !sessionId && sessionNumber === undefined) return items
    return items.filter((item) => {
      if (sessionNumber !== undefined && item.sessionNumber === sessionNumber) return true
      if (sessionId && (item.sessionId === sessionId || item.sessionId === `ses-${sessionNumber}`)) return true
      return false
    })
  }, [items, singleSessionMode, sessionId, sessionNumber])

  // Current session uploading items
  const currentSessionUploadingItems = useMemo(() => {
    return uploadingItems.filter((u) => {
      if (singleSessionMode || sessionId || sessionNumber !== undefined) {
        if (sessionNumber !== undefined && u.sessionNumber === sessionNumber) return true
        if (sessionId && (u.sessionId === sessionId || u.sessionId === `ses-${sessionNumber}`)) return true
        return false
      }
      return true
    })
  }, [uploadingItems, singleSessionMode, sessionId, sessionNumber])

  const filteredItems = useMemo(() => {
    const baseItems = singleSessionMode || sessionId || sessionNumber !== undefined
      ? currentSessionItems
      : items

    const matched = baseItems.filter((item) => {
      if (selectedStudentFilter === 'class_wide') {
        if (item.taggedStudentIds.length !== 0) return false
      } else if (selectedStudentFilter !== 'all') {
        if (!item.taggedStudentIds.includes(selectedStudentFilter)) return false
      }

      return true
    })

    const seenIds = new Set<string>()
    return matched.filter((item) => {
      if (seenIds.has(item.id)) return false
      seenIds.add(item.id)
      return true
    })
  }, [items, currentSessionItems, singleSessionMode, sessionId, sessionNumber, selectedStudentFilter])

  const selectedStudentFilterLabel = useMemo(() => {
    if (selectedStudentFilter === 'all') return 'Tất cả tệp'
    if (selectedStudentFilter === 'class_wide') return 'Dành cho cả lớp'
    const found = rosterStudents.find((st) => st.id === selectedStudentFilter)
    return found ? found.name : 'Đã chọn học viên'
  }, [selectedStudentFilter, rosterStudents])

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

  const handleStudentFilterChange = (filterId: string) => {
    setSelectedStudentFilter(filterId)
    // [CASE-10] Automatically sync selectedItemIds to only keep items that match the new filter
    setSelectedItemIds((prevSelected) => {
      if (prevSelected.length === 0) return prevSelected
      const matchingItems = currentSessionItems.filter((item) => {
        if (filterId === 'class_wide') {
          return item.taggedStudentIds.length === 0
        } else if (filterId !== 'all') {
          return item.taggedStudentIds.includes(filterId)
        }
        return true
      })
      const matchingIds = new Set(matchingItems.map((i) => i.id))
      return prevSelected.filter((id) => matchingIds.has(id))
    })
  }

  const isAllSelected = filteredItems.length > 0 && filteredItems.every((i) => selectedItemIds.includes(i.id))

  const isMediaEmpty = singleSessionMode
    ? filteredItems.length === 0 && currentSessionUploadingItems.length === 0
    : filteredItems.length === 0 && uploadingItems.length === 0

  return (
    <div className="space-y-2">
      {/* ── UNIFIED TOOLBAR ROW ── */}
      <ClassesSessionMediaToolbar
        isAllSelected={isAllSelected}
        filteredItems={filteredItems}
        selectedItemIds={selectedItemIds}
        setSelectedItemIds={setSelectedItemIds}
        selectedStudentFilter={selectedStudentFilter}
        setSelectedStudentFilter={handleStudentFilterChange}
        selectedStudentFilterLabel={selectedStudentFilterLabel}
        rosterStudents={rosterStudents}
        items={singleSessionMode ? currentSessionItems : items}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleBulkDeleteConfirm={handleBulkDeleteConfirm}
        handleBatchTagStudents={handleBatchTagStudents}
        className={className}
      />

      {/* ── MEDIA LISTING ── */}
      {isMediaEmpty ? (
        <ClassesSessionMediaEmptyState
          isFilterActive={selectedStudentFilter !== 'all'}
          filterLabel={selectedStudentFilterLabel}
          totalSessionItemsCount={singleSessionMode ? currentSessionItems.length : items.length}
          onClearFilter={() => setSelectedStudentFilter('all')}
          onUploadClick={() => fileInputRef.current?.click()}
          onDropFiles={handleDropFiles}
          singleSessionMode={singleSessionMode}
        />
      ) : singleSessionMode ? (
        /* Single Session Mode: Direct Grid without session group header label */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
          {/* In-flight uploading cards */}
          {currentSessionUploadingItems.map((uploading) => (
            <ClassesSessionUploadingCard
              key={uploading.id}
              item={uploading}
              onCancel={handleCancelUpload}
            />
          ))}

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
              onPreview={handlePreviewItem}
            />
          ))}
        </div>
      ) : (
        /* Multi-session (Class Detail) Mode: Grouped by session with headers */
        <div className="space-y-6 pt-1">
          {uploadingItems.length > 0 && groupedSessions.length === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {uploadingItems.map((uploading) => (
                <ClassesSessionUploadingCard
                  key={uploading.id}
                  item={uploading}
                  onCancel={handleCancelUpload}
                />
              ))}
            </div>
          )}
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
                  {uploadingItems
                    .filter((u) => u.sessionId === group.sessionId || u.sessionNumber === group.sessionNumber)
                    .map((uploading) => (
                      <ClassesSessionUploadingCard
                        key={uploading.id}
                        item={uploading}
                        onCancel={handleCancelUpload}
                      />
                    ))}
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
                      onPreview={handlePreviewItem}
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

      {/* ── MEDIA LIGHTBOX PREVIEW MODAL (16:9 Widescreen) ── */}
      <MediaPreviewModal
        previewMedia={previewMedia}
        onClose={() => setPreviewMedia(null)}
      />
    </div>
  )
}
