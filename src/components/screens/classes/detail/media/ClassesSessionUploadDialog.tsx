'use client'

import React, { useState, useRef, useMemo, useEffect } from 'react'
import {
  Upload,
  X,
  Check,
  Users,
  UserCheck,
  FileText,
  Film,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Search,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { RosterStudentOption, SessionMediaItem } from './classesSessionMediaTypes'
import {
  MAX_FILES_PER_UPLOAD,
  MAX_IMAGE_DOC_SIZE_BYTES,
  MAX_VIDEO_SIZE_BYTES,
} from './classesSessionMediaTypes'

export interface SelectedFileItem {
  id: string
  file: File
  name: string
  sizeStr: string
  type: 'image' | 'video' | 'doc'
  previewUrl: string
}

export interface ClassesSessionUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  sessionId: string
  sessionNumber: number
  sessionTitle?: string
  sessionDate?: string
  sessionTime?: string
  className?: string
  rosterStudents: RosterStudentOption[]
  initialFiles?: File[]
  onCompleteUpload: (newItems: SessionMediaItem[], activated: boolean) => void
}

function processRawFiles(files: File[], currentCount: number = 0): SelectedFileItem[] {
  if (currentCount + files.length > MAX_FILES_PER_UPLOAD) {
    toast.error(`Mỗi lượt tải lên tối đa ${MAX_FILES_PER_UPLOAD} tệp. Vui lòng chọn lại!`)
    return []
  }

  const newItems: SelectedFileItem[] = []
  for (const file of files) {
    const isImg = file.type.startsWith('image/')
    const isVid = file.type.startsWith('video/')
    const isDoc =
      file.type.startsWith('application/pdf') ||
      file.type.includes('word') ||
      file.name.endsWith('.pdf') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.docx')

    if (!isImg && !isVid && !isDoc) {
      toast.error(`Định dạng "${file.name}" không hỗ trợ. Vui lòng chỉ tải ảnh, video hoặc tài liệu!`)
      continue
    }

    if ((isImg || isDoc) && file.size > MAX_IMAGE_DOC_SIZE_BYTES) {
      toast.error(`Tệp "${file.name}" vượt quá dung lượng tối đa 25MB!`)
      continue
    }

    if (isVid && file.size > MAX_VIDEO_SIZE_BYTES) {
      toast.error(`Tệp video "${file.name}" vượt quá dung lượng tối đa 100MB!`)
      continue
    }

    const type: 'image' | 'video' | 'doc' = isVid ? 'video' : isImg ? 'image' : 'doc'
    const previewUrl = URL.createObjectURL(file)
    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    newItems.push({
      id: `f-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      name: file.name,
      sizeStr,
      type,
      previewUrl,
    })
  }
  return newItems
}

export function ClassesSessionUploadDialog({
  isOpen,
  onClose,
  sessionId,
  sessionNumber,
  sessionTitle = 'Nội dung buổi học',
  sessionDate = '09/05/2026',
  sessionTime = '18:00 - 19:30',
  className = 'IELTS Junior 1A',
  rosterStudents,
  initialFiles = [],
  onCompleteUpload,
}: ClassesSessionUploadDialogProps) {
  // Step 1: Chọn ảnh / tệp tải lên
  // Step 2: Gán học viên & Kích hoạt ảnh
  const [currentStep, setCurrentStep] = useState<1 | 2>(1)
  const [selectedFiles, setSelectedFiles] = useState<SelectedFileItem[]>(() =>
    processRawFiles(initialFiles, 0)
  )
  const [isDragging, setIsDragging] = useState(false)

  // Step 2 Assignment state
  // 'all' = Gán cho cả lớp; 'specific' = Gán cho 1 hoặc nhiều học viên cụ thể
  const [assignmentMode, setAssignmentMode] = useState<'all' | 'specific'>('all')
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([])
  const [studentSearchQuery, setStudentSearchQuery] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((f) => {
        if (f.previewUrl && f.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(f.previewUrl)
        }
      })
    }
  }, [selectedFiles])

  const addFilesToList = (files: File[]) => {
    const valid = processRawFiles(files, selectedFiles.length)
    if (valid.length > 0) {
      setSelectedFiles((prev) => [...prev, ...valid])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFilesToList(Array.from(e.target.files))
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl)
      }
      return prev.filter((item) => item.id !== id)
    })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files) {
      addFilesToList(Array.from(e.dataTransfer.files))
    }
  }

  // Filtered students for Step 2
  const filteredStudents = useMemo(() => {
    if (!studentSearchQuery.trim()) return rosterStudents
    const q = studentSearchQuery.toLowerCase()
    return rosterStudents.filter(
      (st) => st.name.toLowerCase().includes(q) || (st.code && st.code.toLowerCase().includes(q))
    )
  }, [rosterStudents, studentSearchQuery])

  const toggleStudentSelection = (stId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(stId) ? prev.filter((id) => id !== stId) : [...prev, stId]
    )
  }

  const handleSelectAllStudents = () => {
    if (selectedStudentIds.length === rosterStudents.length) {
      setSelectedStudentIds([])
    } else {
      setSelectedStudentIds(rosterStudents.map((s) => s.id))
    }
  }

  // Conversion from SelectedFileItem to SessionMediaItem
  const buildMediaItems = (status: 'active' | 'inactive', taggedIds: string[]): SessionMediaItem[] => {
    return selectedFiles.map((sf, idx) => ({
      id: `media-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 6)}`,
      sessionId,
      sessionNumber,
      sessionTitle,
      sessionDate,
      sessionTime,
      name: sf.name,
      type: sf.type,
      url: sf.previewUrl,
      thumbnailUrl: sf.type === 'image' ? sf.previewUrl : undefined,
      size: sf.sizeStr,
      uploadedBy: 'Giáo viên',
      uploadedAt: 'Vừa xong',
      duration: sf.type === 'video' ? '01:30' : undefined,
      taggedStudentIds: taggedIds,
      status,
    }))
  }

  // Action: Save as inactive (Để sau / Chưa kích hoạt)
  const handleSaveAsInactive = () => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh hoặc tệp để tải lên!')
      return
    }

    const newItems = buildMediaItems('inactive', [])
    onCompleteUpload(newItems, false)
    toast.warning(
      `Đã tải lên ${newItems.length} tệp ở trạng thái Chưa kích hoạt. Bạn có thể gán học viên để kích hoạt sau.`,
      { duration: 4000 }
    )
    onClose()
  }

  // Action: Activate photos (Gán cả lớp hoặc gán học viên)
  const handleActivateAndSubmit = () => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 ảnh hoặc tệp để tải lên!')
      return
    }

    if (assignmentMode === 'specific' && selectedStudentIds.length === 0) {
      toast.error('Vui lòng chọn ít nhất 1 học viên hoặc chọn "Gán cho cả lớp" để kích hoạt ảnh!')
      return
    }

    const taggedIds = assignmentMode === 'all' ? [] : selectedStudentIds
    const newItems = buildMediaItems('active', taggedIds)
    onCompleteUpload(newItems, true)

    if (assignmentMode === 'all') {
      toast.success(`Đã tải lên và kích hoạt thành công ${newItems.length} ảnh cho cả lớp!`)
    } else {
      toast.success(
        `Đã tải lên và kích hoạt thành công ${newItems.length} ảnh cho ${selectedStudentIds.length} học viên!`
      )
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader className="p-5 pb-3 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Upload className="h-4.5 w-4.5 text-sky-600 dark:text-sky-400" />
                <span>Quy trình tải ảnh & tài liệu buổi học</span>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Buổi {sessionNumber}: {sessionTitle} • {className}
              </DialogDescription>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors',
                  currentStep === 1
                    ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-700 font-bold'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                )}
              >
                {currentStep === 2 ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                ) : (
                  <span className="h-4 w-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                )}
                <span>Chọn ảnh</span>
              </div>

              <div className="h-0.5 w-3 bg-zinc-200 dark:bg-zinc-700" />

              <div
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-colors',
                  currentStep === 2
                    ? 'border-sky-500 bg-sky-50 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-700 font-bold'
                    : 'border-zinc-200 text-zinc-400 dark:border-zinc-800'
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 rounded-full flex items-center justify-center text-[10px]',
                    currentStep === 2
                      ? 'bg-sky-600 text-white'
                      : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                  )}
                >
                  2
                </span>
                <span>Gán & Kích hoạt</span>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          multiple
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* ── BƯỚC 1: CHỌN ẢNH & TỆP ── */}
        {currentStep === 1 && (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Drag & Drop Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2.5',
                isDragging
                  ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/50 ring-4 ring-sky-500/20'
                  : 'border-zinc-300 dark:border-zinc-700 hover:border-sky-400 dark:hover:border-sky-600 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/40 bg-zinc-50/30'
              )}
            >
              <div className="h-12 w-12 rounded-full bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-xs">
                <Upload className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">
                  Kéo thả ảnh hoặc video vào đây, hoặc{' '}
                  <span className="text-sky-600 dark:text-sky-400 underline underline-offset-2">
                    nhấp để duyệt tệp
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ JPG, PNG, WEBP (tối đa 25MB), MP4 (tối đa 100MB), PDF/DOC. Tối đa 10 tệp mỗi lượt.
                </p>
              </div>
            </div>

            {/* Selected Files Preview List */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Tệp đã chọn ({selectedFiles.length} tệp)</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setSelectedFiles([])}
                    className="h-6 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                  >
                    Xóa tất cả
                  </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedFiles.map((item) => (
                    <div
                      key={item.id}
                      className="group relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/60 p-2 overflow-hidden flex flex-col gap-1.5 shadow-2xs"
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                        {item.type === 'image' ? (
                          <img
                            src={item.previewUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        ) : item.type === 'video' ? (
                          <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                            <Film className="h-6 w-6 text-sky-500" />
                            <span className="text-[10px] font-bold uppercase">Video</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                            <FileText className="h-6 w-6 text-emerald-500" />
                            <span className="text-[10px] font-bold uppercase">Tài liệu</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveFile(item.id)
                          }}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          title="Bỏ tệp này"
                        >
                          <X className="h-3 w-3 stroke-[2.5]" />
                        </button>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">{item.sizeStr}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Note banner explaining new inactive requirement */}
            <div className="rounded-xl p-3 bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Quy tắc kích hoạt ảnh mới:</p>
                <p className="text-amber-700 dark:text-amber-400">
                  Ảnh tải lên sẽ ở trạng thái <strong className="font-semibold">Chưa kích hoạt (Inactive)</strong>.
                  Bạn cần hoàn tất bước 2 để chọn gán cả lớp hoặc gán cho thành viên nhằm kích hoạt ảnh.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── BƯỚC 2: GÁN HỌC VIÊN & KÍCH HOẠT ── */}
        {currentStep === 2 && (
          <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Context explanation */}
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground">
                Chọn phương thức gán để kích hoạt {selectedFiles.length} ảnh/tệp đã tải
              </h4>
              <p className="text-xs text-muted-foreground">
                Để kích hoạt ảnh hiển thị trên hệ thống, bạn vui lòng chọn gán cho cả lớp hoặc chọn 1 hay nhiều học viên cụ thể.
              </p>
            </div>

            {/* Mini preview strip */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5">
              {selectedFiles.map((f) => (
                <div
                  key={f.id}
                  className="h-12 w-16 shrink-0 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 relative"
                  title={f.name}
                >
                  {f.type === 'image' ? (
                    <img src={f.previewUrl} alt={f.name} className="h-full w-full object-cover" />
                  ) : f.type === 'video' ? (
                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-sky-400">
                      <Film className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-zinc-800 text-emerald-400">
                      <FileText className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Radio Cards: Gán cả lớp vs Gán học viên cụ thể */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Gán cho cả lớp */}
              <div
                onClick={() => setAssignmentMode('all')}
                className={cn(
                  'p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 relative select-none',
                  assignmentMode === 'all'
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-sky-100 dark:bg-sky-900/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Gán cho cả lớp</span>
                  </div>
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border flex items-center justify-center',
                      assignmentMode === 'all'
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700'
                    )}
                  >
                    {assignmentMode === 'all' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Kích hoạt và hiển thị cho tất cả <strong className="font-semibold text-foreground">{rosterStudents.length} học viên</strong> trong lớp.
                </p>
              </div>

              {/* Option B: Gán cho học viên cụ thể */}
              <div
                onClick={() => setAssignmentMode('specific')}
                className={cn(
                  'p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-1.5 relative select-none',
                  assignmentMode === 'specific'
                    ? 'border-sky-500 bg-sky-50/60 dark:bg-sky-950/40 ring-2 ring-sky-500/20'
                    : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-zinc-50/30'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <UserCheck className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold text-foreground">Chỉ định học viên</span>
                  </div>
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full border flex items-center justify-center',
                      assignmentMode === 'specific'
                        ? 'border-sky-600 bg-sky-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700'
                    )}
                  >
                    {assignmentMode === 'specific' && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chọn 1 hoặc nhiều học viên cụ thể. Chỉ những học viên được gắn mới kích hoạt ảnh.
                </p>
              </div>
            </div>

            {/* If Option B: Show Student Selector List */}
            {assignmentMode === 'specific' && (
              <div className="space-y-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-3 bg-zinc-50/40 dark:bg-zinc-900/30 animate-fade-in">
                <div className="flex items-center justify-between gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <Input
                      value={studentSearchQuery}
                      onChange={(e) => setStudentSearchQuery(e.target.value)}
                      placeholder="Tìm học viên trong lớp..."
                      className="pl-8 h-8 text-xs rounded-xl bg-white dark:bg-zinc-900"
                    />
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleSelectAllStudents}
                    className="h-8 text-xs font-semibold rounded-xl shrink-0"
                  >
                    {selectedStudentIds.length === rosterStudents.length
                      ? 'Bỏ chọn tất cả'
                      : 'Chọn tất cả'}
                  </Button>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {filteredStudents.map((st) => {
                    const isChecked = selectedStudentIds.includes(st.id)
                    const bg = st.colorBg || 'bg-amber-100 dark:bg-amber-950/60'
                    const text = st.colorText || 'text-amber-800 dark:text-amber-300'

                    return (
                      <div
                        key={st.id}
                        onClick={() => toggleStudentSelection(st.id)}
                        className={cn(
                          'flex items-center justify-between p-2 rounded-xl cursor-pointer transition-colors text-xs select-none',
                          isChecked
                            ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-900 dark:text-sky-200 font-semibold'
                            : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-foreground'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Checkbox
                            checked={isChecked}
                            onCheckedChange={() => toggleStudentSelection(st.id)}
                            className="rounded-md"
                          />
                          <div
                            className={`h-7 w-7 rounded-full ${bg} ${text} flex items-center justify-center font-bold text-xs shrink-0 border`}
                          >
                            {st.initials || st.name.slice(0, 1)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="truncate block font-semibold text-xs">{st.name}</span>
                            {st.code && (
                              <span className="text-[11px] text-muted-foreground font-mono">{st.code}</span>
                            )}
                          </div>
                        </div>

                        {isChecked && (
                          <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">
                            Đã chọn
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {filteredStudents.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-3">
                      Không tìm thấy học viên
                    </p>
                  )}
                </div>

                <div className="pt-1.5 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Đã chọn <strong className="text-foreground">{selectedStudentIds.length}</strong> / {rosterStudents.length} học viên
                  </span>
                  {selectedStudentIds.length === 0 && (
                    <span className="text-amber-600 dark:text-amber-400 font-medium">
                      ⚠️ Cần chọn ít nhất 1 học viên để kích hoạt
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── FOOTER ACTIONS ── */}
        <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 flex items-center justify-between gap-2">
          {currentStep === 1 ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="h-8.5 rounded-xl text-xs font-semibold"
              >
                Hủy
              </Button>

              <div className="flex items-center gap-2">
                {selectedFiles.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSaveAsInactive}
                    className="h-8.5 rounded-xl text-xs font-semibold border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                    title="Tải lên và lưu ở trạng thái Chưa kích hoạt để gán sau"
                  >
                    Lưu tạm (Chưa kích hoạt)
                  </Button>
                )}

                <Button
                  type="button"
                  size="sm"
                  disabled={selectedFiles.length === 0}
                  onClick={() => setCurrentStep(2)}
                  className="h-8.5 px-4 rounded-xl text-xs font-bold gap-1.5 bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-xs disabled:opacity-50"
                >
                  <span>Tiếp tục: Gán học viên</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setCurrentStep(1)}
                className="h-8.5 rounded-xl text-xs font-semibold gap-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Quay lại</span>
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSaveAsInactive}
                  className="h-8.5 rounded-xl text-xs font-semibold border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                  title="Chưa muốn gán bây giờ? Lưu ở trạng thái chưa kích hoạt để xử lý sau"
                >
                  Để sau (Chưa kích hoạt)
                </Button>

                <Button
                  type="button"
                  size="sm"
                  onClick={handleActivateAndSubmit}
                  className="h-8.5 px-4 rounded-xl text-xs font-bold gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer shadow-xs"
                >
                  <Check className="h-4 w-4 stroke-[3]" />
                  <span>Kích hoạt ảnh</span>
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
