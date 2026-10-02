'use client'

import React, { useMemo } from 'react'
import { FormattedEvaluationContent } from './FormattedEvaluationContent'
import { MonthlyReportActivityPhotosSection } from './MonthlyReportActivityPhotosSection'
import type { StudentGalleryPhoto } from '@/mocks/studentPhotos'
import {
  composeSectionA1,
  decomposeSectionA1,
  composeSectionA2,
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
}: MonthlyReportAcademicSectionProps) {
  const a1Data = useMemo(() => {
    return decomposeSectionA1(sectionA1Content)
  }, [sectionA1Content])

  const a2Data = useMemo(() => {
    return decomposeSectionA2(sectionA2Content, isMath)
  }, [sectionA2Content, isMath])

  return (
    <div id={`${idPrefix}-section-a`} className="space-y-4 pt-2 border-t">
      <h4 className="text-sm font-extrabold text-foreground uppercase tracking-wide">
        A - BÁO CÁO HỌC TẬP {monthTitle.toUpperCase()}
      </h4>

      {/* Sub-section A1: 1. Nhận xét chung */}
      <div className="space-y-2 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            1. Nhận xét chung
          </label>
        </div>
        {isEditing ? (
          <div className="space-y-3.5">
            {/* Box 1: Điểm nổi bật */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
                  Điểm nổi bật (Ưu điểm)
                </label>
                <span className="text-[11px] text-muted-foreground">Thái độ, ý thức, sự phối hợp</span>
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
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-border/80 bg-background focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[68px] transition-colors"
              />
            </div>

            {/* Box 2: Điểm cần lưu ý */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block shrink-0" />
                  Điểm cần lưu ý (Cần rèn luyện)
                </label>
                <span className="text-[11px] text-muted-foreground">Tốc độ phản xạ, sự tự tin</span>
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
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-border/80 bg-background focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[68px] transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="w-full text-sm p-3.5 sm:p-4 rounded-xl border border-border/50 bg-muted/10 text-foreground leading-relaxed font-sans">
            <FormattedEvaluationContent
              content={sectionA1Content}
              type="general"
            />
          </div>
        )}
      </div>

      {/* Sub-section A2: 2. Nhận xét về kết quả học tập */}
      <div className="space-y-2 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            2. Nhận xét về kết quả học tập
          </label>
        </div>
        {isEditing ? (
          <div className="space-y-3.5">
            {/* Box 1: Từ vựng & Phonics (hoặc Kiến thức & Tư duy) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <label className="text-xs font-bold text-sky-700 dark:text-sky-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 inline-block shrink-0" />
                  {isMath ? 'Kiến thức & Tư duy toán' : 'Từ vựng & Phonics'}
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {isMath ? 'Khả năng hiểu bài, tư duy' : 'Mức độ nhớ từ, phát âm'}
                </span>
              </div>
              <textarea
                rows={2}
                value={a2Data.knowledge}
                onChange={(e) => {
                  const newKnowledge = e.target.value
                  onUpdateA2(
                    composeSectionA2(newKnowledge, a2Data.skill, isMath),
                    newKnowledge,
                    a2Data.skill
                  )
                }}
                placeholder={
                  isMath
                    ? 'Nhập đánh giá về mức độ tiếp thu kiến thức và tư duy logic của con...'
                    : 'Nhập đánh giá về khả năng nhớ từ vựng, phát âm, nhận biết chữ cái...'
                }
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-border/80 bg-background focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[68px] transition-colors"
              />
            </div>

            {/* Box 2: Cấu trúc & Mẫu câu (hoặc Kỹ năng giải toán) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <label className="text-xs font-bold text-violet-700 dark:text-violet-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-500 inline-block shrink-0" />
                  {isMath ? 'Kỹ năng giải toán' : 'Cấu trúc & Mẫu câu'}
                </label>
                <span className="text-[11px] text-muted-foreground">
                  {isMath ? 'Phương pháp giải, trình bày' : 'Phản xạ và sử dụng mẫu câu'}
                </span>
              </div>
              <textarea
                rows={2}
                value={a2Data.skill}
                onChange={(e) => {
                  const newSkill = e.target.value
                  onUpdateA2(
                    composeSectionA2(a2Data.knowledge, newSkill, isMath),
                    a2Data.knowledge,
                    newSkill
                  )
                }}
                placeholder={
                  isMath
                    ? 'Nhập đánh giá về kỹ năng làm bài, phương pháp tư duy và tính toán...'
                    : 'Nhập đánh giá về mức độ phản xạ mẫu câu, ngữ pháp và hội thoại...'
                }
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-border/80 bg-background focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 focus:outline-none leading-relaxed font-sans resize-y min-h-[68px] transition-colors"
              />
            </div>
          </div>
        ) : (
          <div className="w-full text-sm p-3.5 sm:p-4 rounded-xl border border-border/50 bg-muted/10 text-foreground leading-relaxed font-sans">
            <FormattedEvaluationContent
              content={sectionA2Content}
              type="academic"
            />
          </div>
        )}
      </div>

      {/* Sub-section A3: 3. Khoảnh khắc học tập (Hình ảnh & Video hoạt động trong tháng) */}
      <MonthlyReportActivityPhotosSection
        photos={galleryPhotos}
        onChange={onChangePhotos}
        readOnly={!isEditing}
        studentId={studentId}
        studentName={studentName}
        monthName={monthTitle}
      />
    </div>
  )
}
