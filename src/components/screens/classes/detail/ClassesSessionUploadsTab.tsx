'use client'

import React, { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Upload,
  FileImage,
  FileVideo,
  Link2,
  FileText,
  Trash2,
  Download,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { ConfirmDialog, EmptyState } from '@/components/shared'
import { SegmentedControl, type SegmentedControlOption } from '@/components/controls'
import type { RoadmapSession, RosterStudent } from './classesDetailTypes'
import { stableHash, getInitials, getAvatarColor } from './classesSessionDetailHelpers'

interface ClassesSessionUploadsTabProps {
  session: RoadmapSession
  activeRoster: RosterStudent[]
  onUpload?: (sessionId: string) => void
}

type FilterTab = 'all' | 'class' | 'student'

const FILTER_OPTIONS: SegmentedControlOption<FilterTab>[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'class', label: 'Lớp' },
  { value: 'student', label: 'Học viên' },
]

export function ClassesSessionUploadsTab({
  session,
  activeRoster,
  onUpload,
}: ClassesSessionUploadsTabProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [selectedMaterials, setSelectedMaterials] = useState<Record<number, boolean>>({})
  const [materialsList, setMaterialsList] = useState(session.materials || [])
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  // ── Enriched materials with file type classification, size, upload date, and member association ──
  const enrichedMaterials = useMemo(() => {
    return materialsList.map((mat, idx) => {
      const lowerName = mat.name.toLowerCase()
      let fileType: 'ảnh' | 'video' | 'link' | 'tài liệu' = 'tài liệu'
      if (lowerName.includes('link') || lowerName.includes('http') || (mat.url.startsWith('http') && !mat.url.includes('.'))) {
        fileType = 'link'
      } else if (lowerName.includes('mp4') || lowerName.includes('mov') || lowerName.includes('video') || lowerName.includes('clip')) {
        fileType = 'video'
      } else if (lowerName.includes('png') || lowerName.includes('jpg') || lowerName.includes('jpeg') || lowerName.includes('ảnh') || lowerName.includes('img')) {
        fileType = 'ảnh'
      }

      const size = fileType === 'link' ? '—' : `${((stableHash(mat.name) % 90) / 10 + 1).toFixed(1)} MB`
      const uploadDate = session.date

      // 30% assigned to a specific student, 70% shared with everyone
      const isStudentSpecific = idx % 3 === 0 && activeRoster.length > 0
      const student = isStudentSpecific ? activeRoster[idx % activeRoster.length] : null

      return {
        ...mat,
        fileType,
        size,
        uploadDate,
        student,
        originalIdx: idx, // Map back to index in materialsList
      }
    })
  }, [materialsList, session.date, activeRoster])

  // Filter materials based on selected tab group
  const displayMaterials = useMemo(() => {
    return enrichedMaterials.filter((mat) => {
      if (activeFilter === 'class') {
        return mat.student === null
      }
      if (activeFilter === 'student') {
        return mat.student !== null
      }
      return true
    })
  }, [enrichedMaterials, activeFilter])

  const selectedCount = Object.keys(selectedMaterials).filter(k => selectedMaterials[Number(k)]).length

  return (
    <div className="space-y-4">
      {/* ── Filter controls & Actions in header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-3">
        <SegmentedControl
          value={activeFilter}
          options={FILTER_OPTIONS}
          onValueChange={setActiveFilter}
          className="bg-transparent p-0 gap-1"
          itemClassName="h-7 px-2.5 text-[11px] border border-transparent [&.bg-background]:border-primary [&.bg-background]:bg-primary [&.bg-background]:text-primary-foreground shadow-none"
        />
        
        <div className="flex items-center gap-2">
          {selectedCount > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 rounded-lg text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => {
                setMaterialsList(prev => prev.filter((_, idx) => !selectedMaterials[idx]))
                toast.success(`Đã xóa ${selectedCount} tài liệu đã chọn!`)
                setSelectedMaterials({})
              }}
            >
              Xóa đã chọn
            </Button>
          )}
          {session.status !== 'cancelled' && session.status !== 'absent' && onUpload && (
            <Button
              type="button"
              size="sm"
              className="h-8 rounded-lg text-xs gap-1.5"
              onClick={() => onUpload(session.id)}
            >
              <Upload className="h-3.5 w-3.5" />
              Tải tài liệu mới
            </Button>
          )}
        </div>
      </div>

      {displayMaterials.length > 0 ? (
        <div className="border border-zinc-200 rounded-xl overflow-hidden shadow-2xs bg-white dark:bg-zinc-900 dark:border-zinc-800">
          <div className="overflow-auto max-h-[360px]">
            <table className="w-full text-xs text-left border-collapse">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-10">
                <tr>
                  <th className="py-2.5 px-3 w-[40px] text-center">
                    <input
                      type="checkbox"
                      className="h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-zinc-900"
                      checked={
                        displayMaterials.length > 0 &&
                        displayMaterials.every((mat) => !!selectedMaterials[mat.originalIdx])
                      }
                      onChange={(e) => {
                        const checked = e.target.checked
                        setSelectedMaterials((prev) => {
                          const next = { ...prev }
                          displayMaterials.forEach((mat) => {
                            if (checked) {
                              next[mat.originalIdx] = true
                            } else {
                              delete next[mat.originalIdx]
                            }
                          })
                          return next
                        })
                      }}
                    />
                  </th>
                  <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400">Tên tài liệu</th>
                  <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[120px]">Dung lượng</th>
                  <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[140px]">Ngày upload</th>
                  <th className="py-2.5 px-3 font-semibold text-zinc-500 dark:text-zinc-400 w-[200px]">Thành viên</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                {displayMaterials.map((mat) => {
                  const hasUrl = !!mat.url && mat.url !== '#'
                  const originalIdx = mat.originalIdx

                  return (
                    <tr
                      key={originalIdx}
                      className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-2.5 px-3 text-center">
                        <input
                          type="checkbox"
                          className="h-3.5 w-3.5 rounded border-zinc-300 dark:border-zinc-700 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-zinc-900"
                          checked={!!selectedMaterials[originalIdx]}
                          onChange={(e) => {
                            const checked = e.target.checked
                            setSelectedMaterials((prev) => ({
                              ...prev,
                              [originalIdx]: checked,
                            }))
                          }}
                        />
                      </td>
                      <td className="py-2.5 px-3 font-medium text-foreground">
                        <div className="flex items-center justify-between gap-2 w-full">
                          <div className="flex items-center gap-2 min-w-0">
                            {mat.fileType === 'ảnh' && (
                              <FileImage className="h-4 w-4 text-emerald-500 shrink-0" />
                            )}
                            {mat.fileType === 'video' && (
                              <FileVideo className="h-4 w-4 text-rose-500 shrink-0" />
                            )}
                            {mat.fileType === 'link' && (
                              <Link2 className="h-4 w-4 text-sky-500 shrink-0" />
                            )}
                            {mat.fileType === 'tài liệu' && (
                              <FileText className="h-4 w-4 text-primary shrink-0" />
                            )}
                            {hasUrl ? (
                              <a
                                href={mat.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-primary hover:underline font-semibold truncate max-w-[240px]"
                                title={mat.name}
                              >
                                {mat.name}
                              </a>
                            ) : (
                              <span className="truncate max-w-[240px] text-zinc-500" title={mat.name}>
                                {mat.name}
                              </span>
                            )}
                          </div>

                          {/* Hover action icons */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            {mat.fileType !== 'link' && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 rounded-full text-zinc-400 hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast.success(`Đang tải xuống tài liệu "${mat.name}"...`)
                                }}
                                title="Tải xuống tài liệu"
                              >
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeletingIndex(originalIdx)
                              }}
                              title="Xóa tài liệu"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400 font-mono">
                        {mat.size}
                      </td>
                      <td className="py-2.5 px-3 text-zinc-600 dark:text-zinc-400 font-mono">
                        {mat.uploadDate}
                      </td>
                      <td className="py-2.5 px-3">
                        {mat.student ? (
                          <div className="flex items-center gap-2">
                            <div className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                              getAvatarColor(mat.student.id)
                            )}>
                              {getInitials(mat.student.name)}
                            </div>
                            <span className="text-[11px] font-medium text-foreground truncate max-w-[120px]" title={mat.student.name}>
                              {mat.student.name}
                            </span>
                          </div>
                        ) : (
                          <Badge variant="outline" className="rounded-md text-[9px] font-bold px-1.5 py-0 border-zinc-200 bg-zinc-50 text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
                            Tất cả thành viên
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* ── Standard empty state per document filter group ── */
        <div className="py-4">
          <EmptyState
            title="Không có tài liệu"
            description={
              activeFilter === 'class'
                ? 'Không có tài liệu nào được chia sẻ cho cả lớp.'
                : activeFilter === 'student'
                ? 'Không có tài liệu nào được chỉ định riêng cho học viên.'
                : 'Buổi học này hiện tại chưa được đăng tải tài liệu giảng dạy nào.'
            }
          />
        </div>
      )}

      <ConfirmDialog
        open={deletingIndex !== null}
        onOpenChange={(open) => { if (!open) setDeletingIndex(null) }}
        title="Xóa tài liệu"
        description={deletingIndex !== null && materialsList[deletingIndex] ? `Bạn có chắc chắn muốn xóa tài liệu "${materialsList[deletingIndex].name}"? Hành động này không thể hoàn tác.` : ''}
        confirmLabel="Xóa"
        variant="destructive"
        onConfirm={() => {
          if (deletingIndex !== null) {
            const matName = materialsList[deletingIndex].name
            setMaterialsList(prev => prev.filter((_, i) => i !== deletingIndex))
            toast.success(`Đã xóa tài liệu "${matName}" thành công!`)
            setSelectedMaterials(prev => {
              const next = { ...prev }
              delete next[deletingIndex]
              return next
            })
            setDeletingIndex(null)
          }
        }}
      />
    </div>
  )
}
