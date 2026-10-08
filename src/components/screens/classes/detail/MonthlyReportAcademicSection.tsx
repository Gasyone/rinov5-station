'use client'

import React, { useMemo } from 'react'
import { FormattedEvaluationContent } from './FormattedEvaluationContent'
import { MonthlyReportActivityPhotosSection } from './MonthlyReportActivityPhotosSection'
import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'
import {
  composeSectionA1,
  decomposeSectionA1,
  decomposeSectionA2,
} from './monthlyReportHelpers'

interface MonthlyReportAcademicSectionProps {
  isEditing: boolean
  isMath: boolean
  monthTitle: string
  studentId: string
  studentName: string
  sectionA1Content: string
  sectionA2Content: string
  onUpdateA1: (content: string, highlight: string, note: string) => void
  onUpdateA2: (content: string, knowledge: string, skill: string) => void
  galleryPhotos: StudentGalleryPhoto[]
  onChangePhotos?: (photos: StudentGalleryPhoto[]) => void
  idPrefix?: string
  showPhotosSection?: boolean
}

export function MonthlyReportAcademicSection({
  isEditing,
  isMath,
  monthTitle,
  studentId,
  studentName,
  sectionA1Content,
  sectionA2Content,
  onUpdateA1,
  onUpdateA2,
  galleryPhotos,
  onChangePhotos,
  idPrefix = 'report',
  showPhotosSection = true,
}: MonthlyReportAcademicSectionProps) {
  const a1Data = useMemo(() => {
    return decomposeSectionA1(sectionA1Content)
  }, [sectionA1Content])

  return (
    <div id={`${idPrefix}-section-a`} className="space-y-2 pt-0">
      <h4 className="text-xs sm:text-sm font-semibold text-foreground">
        A. Báo cáo học tập {monthTitle}
      </h4>

      {/* Sub-section A1: 1. Nhận xét chung */}
      <div className="space-y-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
            1. Nhận xét chung
          </label>
        </div>
        {isEditing ? (
          <div className="space-y-2">
            {/* Dòng 1: Điểm nổi bật */}
            <div className="space-y-1">
              <div className="h-5 flex items-center justify-between gap-1">
                <label className="text-xs font-normal text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                  Điểm nổi bật
                </label>
                <span className="text-[11px] text-muted-foreground truncate text-right">Ưu điểm, thái độ</span>
              </div>
              <textarea
                rows={2}
                value={a1Data.highlight}
                onChange={(e) => {
                  const newHighlight = e.target.value
                  onUpdateA1(
                    composeSectionA1(newHighlight, a1Data.note),
                    newHighlight,
                    a1Data.note
                  )
                }}
                placeholder="Nhập những điểm con làm tốt, thái độ tích cực trong kỳ..."
                className="w-full text-xs p-2 rounded-lg border border-border/80 bg-background focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[52px] transition-colors font-normal"
              />
            </div>

            {/* Dòng 2: Điểm cần lưu ý */}
            <div className="space-y-1">
              <div className="h-5 flex items-center justify-between gap-1">
                <label className="text-xs font-normal text-amber-700 dark:text-amber-400 flex items-center gap-1.5 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                  Điểm cần lưu ý
                </label>
                <span className="text-[11px] text-muted-foreground truncate text-right">Cần rèn luyện</span>
              </div>
              <textarea
                rows={2}
                value={a1Data.note}
                onChange={(e) => {
                  const newNote = e.target.value
                  onUpdateA1(
                    composeSectionA1(a1Data.highlight, newNote),
                    a1Data.highlight,
                    newNote
                  )
                }}
                placeholder="Nhập những điểm con cần cải thiện, điểm cần rèn luyện thêm..."
                className="w-full text-xs p-2 rounded-lg border border-border/80 bg-background focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[52px] transition-colors font-normal"
              />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground/90 leading-relaxed font-sans">
            <FormattedEvaluationContent
              content={sectionA1Content}
              type="general"
            />
          </div>
        )}
      </div>

      {/* Sub-section A2: 2. Nhận xét về kết quả học tập (Gộp chung 1 ô tự điền) */}
      <div className="space-y-1 pt-0.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-normal text-muted-foreground flex items-center gap-1.5">
            2. Đánh giá kết quả học tập
          </label>
        </div>
        {isEditing ? (
          <textarea
            rows={3}
            value={sectionA2Content}
            onChange={(e) => {
              const newContent = e.target.value
              const parsed = decomposeSectionA2(newContent, isMath)
              onUpdateA2(newContent, parsed.knowledge, parsed.skill)
            }}
            placeholder={
              isMath
                ? 'Nhập đánh giá về kiến thức tư duy logic và kỹ năng giải toán của con...'
                : 'Nhập đánh giá về từ vựng, phonics và cấu trúc mẫu câu của con...'
            }
            className="w-full text-xs p-2 rounded-lg border border-border/80 bg-background focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[64px] transition-colors font-normal"
          />
        ) : (
          <div className="rounded-lg border border-border/60 bg-muted/20 px-2.5 py-1.5 text-xs text-foreground/90 leading-relaxed font-sans">
            <FormattedEvaluationContent
              content={sectionA2Content}
              type="academic"
            />
          </div>
        )}
      </div>

      {/* Sub-section A3: 3. Khoảnh khắc học tập (Chỉ hiển thị nếu showPhotosSection = true) */}
      {showPhotosSection && (
        <MonthlyReportActivityPhotosSection
          photos={galleryPhotos}
          onChange={onChangePhotos}
          readOnly={!isEditing}
          studentId={studentId}
          studentName={studentName}
          monthName={monthTitle}
        />
      )}
    </div>
  )
}
