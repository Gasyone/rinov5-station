'use client'

import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Music,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { TeachingMaterial } from './liveTeachingTypes'

interface LiveMaterialViewerProps {
  material: TeachingMaterial
  lessonTitle?: string
  isMath?: boolean
}

export function LiveMaterialViewer({
  material,
  lessonTitle = 'J1_Pooka, Wooka (Tiết 2)',
  isMath = true,
}: LiveMaterialViewerProps) {
  const [currentPage, setCurrentPage] = useState(material.defaultPage || 2)
  const totalPages = material.totalPages || 18
  const [zoomLevel, setZoomLevel] = useState(100)
  const [viewMode, setViewMode] = useState<'slide' | 'raw_pdf'>('slide')

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
  }

  const materialType = material.type
  const pdfUrl = material.url
  const videoUrl = material.url
  const audioUrl = material.url

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-950/5 dark:bg-zinc-950/40 relative overflow-hidden">
      {/* ── Top Bar inside Viewer: Page controls & Mode toggle (Gọn gàng, tỉ lệ chuẩn) ── */}
      <div className="h-9 px-3 border-b bg-zinc-100/90 dark:bg-zinc-900/90 flex items-center justify-between gap-2 shrink-0 text-xs">
        <div className="flex items-center gap-2">
          {materialType === 'pdf' ? (
            <>
              <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 p-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
                <button
                  type="button"
                  onClick={() => setViewMode('slide')}
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-semibold transition-all cursor-pointer',
                    viewMode === 'slide'
                      ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Bản trình chiếu Slide
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('raw_pdf')}
                  className={cn(
                    'px-2 py-0.5 rounded text-xs font-semibold transition-all cursor-pointer',
                    viewMode === 'raw_pdf'
                      ? 'bg-primary text-primary-foreground font-bold shadow-2xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  File PDF nhúng (Gốc)
                </button>
              </div>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary hover:underline font-medium ml-1"
                title="Mở tài liệu trên tab mới"
              >
                <span>Mở link gốc</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </>
          ) : (
            <span className="font-bold text-foreground flex items-center gap-1.5 text-xs">
              <Video className="h-3.5 w-3.5 text-sky-500" />
              Video hướng dẫn giảng dạy
            </span>
          )}
        </div>

        {materialType === 'pdf' && viewMode === 'slide' && (
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center gap-1 text-muted-foreground">
              <Button
                variant="ghost"
                size="icon"
                className="h-5.5 w-5.5 rounded"
                onClick={() => setZoomLevel((prev) => Math.max(75, prev - 15))}
                disabled={zoomLevel <= 75}
                title="Thu nhỏ"
              >
                <ZoomOut className="h-3 w-3" />
              </Button>
              <span className="text-[10.5px] font-mono font-medium w-8 text-center">{zoomLevel}%</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5.5 w-5.5 rounded"
                onClick={() => setZoomLevel((prev) => Math.min(150, prev + 15))}
                disabled={zoomLevel >= 150}
                title="Phóng to"
              >
                <ZoomIn className="h-3 w-3" />
              </Button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-0.5 ml-1 bg-white dark:bg-zinc-800 px-1 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-700">
              <Button
                variant="ghost"
                size="icon"
                className="h-5.5 w-5.5 rounded text-zinc-600 dark:text-zinc-400"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                title="Trang trước"
              >
                <ChevronLeft className="h-3 w-3" />
              </Button>

              <span className="text-[10.5px] font-mono font-bold px-1 text-foreground">
                Trang {currentPage} / {totalPages}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-5.5 w-5.5 rounded text-zinc-600 dark:text-zinc-400"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                title="Trang sau"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Main Canvas Viewport (Tỉ lệ chuẩn, cân đối, thoáng mắt) ── */}
      <div className="flex-1 flex flex-col min-h-0 w-full h-full p-2 sm:p-2.5 overflow-hidden items-center justify-center">
        {materialType === 'audio' ? (
          /* ── AUDIO PLAYER & TRANSCRIPT VIEW ── */
          <div className="w-full h-full flex-1 bg-white dark:bg-zinc-900 rounded-xl p-4 sm:p-6 border shadow-md flex flex-col justify-center max-w-3xl mx-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center shrink-0 shadow-inner">
                <Music className="h-5.5 w-5.5" />
              </div>
              <div className="min-w-0 flex-1">
                <Badge variant="outline" className="text-[9.5px] font-bold text-purple-600 border-purple-300 mb-0.5">
                  Audio Bài Nghe Bản Ngữ
                </Badge>
                <h3 className="font-bold text-sm text-foreground truncate">{material.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{material.description || 'Luyện phát âm & nghe hiểu câu chuyện'}</p>
              </div>
            </div>

            {/* Native Audio element */}
            <div className="p-2.5 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700">
              <audio src={audioUrl} controls className="w-full h-8" />
            </div>

            {/* Story Transcript */}
            <div className="p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-950/40 border space-y-2 flex-1 min-h-0 overflow-y-auto">
              <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
                Nội dung bài nghe (Transcript):
              </span>
              <div className="space-y-1.5 text-xs leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium pl-1">
                <p>🔊 <strong>Narrator:</strong> &quot;Welcome to Story time! Today we join Billy and Emma on their classroom adventure.&quot;</p>
                <p>👦 <strong>Billy:</strong> &quot;Look! What is this on the table?&quot;</p>
                <p>👧 <strong>Emma:</strong> &quot;It is a green notebook! And beside it, there is a red pencil and an eraser.&quot;</p>
                <p>👩‍🏫 <strong>Teacher:</strong> &quot;Excellent, Emma! Can you use a full sentence: &apos;This is a pencil&apos;?&quot;</p>
                <p>👧 <strong>Emma:</strong> &quot;Yes, teacher! This is a pencil, and these are our books!&quot;</p>
              </div>
            </div>
          </div>
        ) : materialType === 'video' ? (
          /* ── VIDEO PLAYER VIEW ── */
          <div className="w-full h-full flex-1 bg-black rounded-xl overflow-hidden shadow-lg border border-zinc-800 flex items-center justify-center relative group max-w-4xl mx-auto">
            <video
              src={videoUrl}
              className="w-full h-full object-contain"
              controls
            />
          </div>
        ) : viewMode === 'raw_pdf' ? (
          /* ── EMBEDDED RAW PDF IFRAME VIEW ── */
          <div className="w-full h-full flex-1 bg-white dark:bg-zinc-900 rounded-xl overflow-hidden border shadow-md flex flex-col max-w-5xl mx-auto">
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=0`}
              title="Slide tài liệu PDF"
              className="w-full h-full border-none flex-1"
            />
          </div>
        ) : (
          /* ── HIGH-FIDELITY INTERACTIVE SLIDE CANVAS (TỈ LỆ CÂN ĐỐI, THOÁNG ĐẸP) ── */
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full h-full flex-1 bg-[#fbfbfa] dark:bg-zinc-900 border border-emerald-500/25 dark:border-emerald-600/30 rounded-xl p-3 sm:p-4 flex flex-col justify-between shadow-md transition-transform duration-150 relative overflow-hidden select-none max-w-5xl mx-auto"
          >
            {/* Watermark brand */}
            <div className="absolute top-2.5 right-4 flex items-center gap-1 opacity-90">
              <span className="text-xs font-bold text-red-600 tracking-tight">RinoEdu</span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
            </div>

            {/* Slide Title */}
            <div className="text-center pt-0 pb-1.5 shrink-0">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100 font-sans tracking-tight">
                {currentPage === 2
                  ? lessonTitle
                  : isMath
                    ? `J1_Pooka, Wooka (Tiết 2) — Phần ${currentPage}`
                    : `IELTS Junior / Cambridge — Part ${currentPage}`}
              </h2>
            </div>

            {/* Slide Body: 2 Rounded Dashed Columns */}
            {currentPage === 2 ? (
              isMath ? (
                /* ── TOÁN TƯ DUY SLIDE (POOKA & WOOKA) ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 flex-1 items-stretch my-1">
                  {/* Left Card: Yêu cầu cần đạt */}
                  <div className="rounded-xl border border-dashed border-teal-400 dark:border-teal-600/60 bg-white/80 dark:bg-zinc-950/40 p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h3 className="text-center text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm mb-2 pb-1 border-b border-teal-100 dark:border-teal-900/40">
                        Yêu cầu cần đạt
                      </h3>
                      <ul className="space-y-1.5 text-xs sm:text-xs text-zinc-800 dark:text-zinc-200 leading-snug font-medium">
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>Nhận biết được vị trí các số có 2 chữ số trong bảng 100.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>Đọc thành thạo các số trong phạm vi 50.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>Xác định được quy luật tăng giảm của các số qua các dấu chân của các con vật.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>Hiểu được cấu tạo của số bằng cách tách số thành hàng chục và hàng đơn vị.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-teal-600 font-bold">•</span>
                          <span>Thực hiện được tạo số có 2 chữ số trong phạm vi 50 bằng quân domino.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 pt-1 text-base sm:text-lg opacity-80">
                      <span title="Gà con">🐣</span>
                      <span title="Vịt Wooka">🦆</span>
                      <span title="Chó Pooka">🐕</span>
                    </div>
                  </div>

                  {/* Right Card: Tư duy toán học, tư duy logic */}
                  <div className="rounded-xl border border-dashed border-teal-400 dark:border-teal-600/60 bg-white/80 dark:bg-zinc-950/40 p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h3 className="text-center text-emerald-800 dark:text-emerald-300 font-bold text-xs sm:text-sm mb-2 pb-1 border-b border-teal-100 dark:border-teal-900/40">
                        Tư duy toán học, tư duy logic
                      </h3>
                      <div className="space-y-2 text-xs sm:text-xs text-zinc-800 dark:text-zinc-200 leading-snug font-medium">
                        <div>
                          <p className="font-bold text-emerald-700 dark:text-emerald-400 italic mb-0.5 flex items-center gap-1 text-[11.5px]">
                            <span>1. Tư duy toán học</span>
                          </p>
                          <ul className="space-y-1 pl-2">
                            <li className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">-</span>
                              <span>Xác định được vị trí số theo hàng, cột.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">-</span>
                              <span>Nhận biết được số có 2 chữ số gồm phần chục và đơn vị.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">-</span>
                              <span>Vận dụng được phép tách số.</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold text-emerald-700 dark:text-emerald-400 italic mb-0.5 flex items-center gap-1 text-[11.5px]">
                            <span>2. Tư duy Logic</span>
                          </p>
                          <ul className="space-y-1 pl-2">
                            <li className="flex items-start gap-1.5">
                              <span className="text-teal-600 font-bold">-</span>
                              <span>Suy luận được vị trí các số dựa trên quy luật.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-1 text-lg sm:text-xl opacity-80 pr-2">
                      <span title="Gà con">🐥</span>
                      <span title="Vịt">🦆</span>
                      <span title="Chó đốm Pooka">🐕</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* ── TIẾNG ANH CAMBRIDGE SLIDE (MY FAMILY ADVENTURE) ── */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5 flex-1 items-stretch my-1">
                  {/* Left Card: Lesson Targets */}
                  <div className="rounded-xl border border-dashed border-sky-400 dark:border-sky-600/60 bg-white/80 dark:bg-zinc-950/40 p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h3 className="text-center text-sky-800 dark:text-sky-300 font-bold text-xs sm:text-sm mb-2 pb-1 border-b border-sky-100 dark:border-sky-900/40">
                        Lesson Objectives & Targets
                      </h3>
                      <ul className="space-y-1.5 text-xs sm:text-xs text-zinc-800 dark:text-zinc-200 leading-snug font-medium">
                        <li className="flex items-start gap-1.5">
                          <span className="text-sky-600 font-bold">•</span>
                          <span><strong>Words:</strong> pencil, eraser, notebook, classroom, teacher, student.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-sky-600 font-bold">•</span>
                          <span><strong>Sentences:</strong> What is this? It&apos;s a pencil. Where is your notebook?</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-sky-600 font-bold">•</span>
                          <span><strong>Grammar:</strong> Demonstrative pronouns (This / That / These / Those).</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-sky-600 font-bold">•</span>
                          <span><strong>Story time:</strong> Read aloud & comprehension: My Family Adventure.</span>
                        </li>
                        <li className="flex items-start gap-1.5">
                          <span className="text-sky-600 font-bold">•</span>
                          <span><strong>Speaking:</strong> Role-play asking and answering about classroom objects.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-center gap-2.5 pt-1 text-base sm:text-lg opacity-80">
                      <span title="Học sinh">👦</span>
                      <span title="Học sinh">👧</span>
                      <span title="Cặp sách">🎒</span>
                    </div>
                  </div>

                  {/* Right Card: Core Language Competencies */}
                  <div className="rounded-xl border border-dashed border-sky-400 dark:border-sky-600/60 bg-white/80 dark:bg-zinc-950/40 p-3 sm:p-3.5 flex flex-col justify-between shadow-2xs">
                    <div>
                      <h3 className="text-center text-sky-800 dark:text-sky-300 font-bold text-xs sm:text-sm mb-2 pb-1 border-b border-sky-100 dark:border-sky-900/40">
                        Core Language Competencies
                      </h3>
                      <div className="space-y-2 text-xs sm:text-xs text-zinc-800 dark:text-zinc-200 leading-snug font-medium">
                        <div>
                          <p className="font-bold text-sky-700 dark:text-sky-400 italic mb-0.5 flex items-center gap-1 text-[11.5px]">
                            <span>1. Pronunciation & Phonics</span>
                          </p>
                          <ul className="space-y-1 pl-2">
                            <li className="flex items-start gap-1.5">
                              <span className="text-sky-600 font-bold">-</span>
                              <span>Phát âm chuẩn từ vựng đồ dùng học tập.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-sky-600 font-bold">-</span>
                              <span>Bật rõ các âm đuôi /s/, /t/ trong từ vựng.</span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <p className="font-bold text-sky-700 dark:text-sky-400 italic mb-0.5 flex items-center gap-1 text-[11.5px]">
                            <span>2. Fluency & Interaction</span>
                          </p>
                          <ul className="space-y-1 pl-2">
                            <li className="flex items-start gap-1.5">
                              <span className="text-sky-600 font-bold">-</span>
                              <span>Tự tin đối thoại theo cặp và phản xạ câu hỏi nhanh.</span>
                            </li>
                            <li className="flex items-start gap-1.5">
                              <span className="text-sky-600 font-bold">-</span>
                              <span>Nói thành câu hoàn chỉnh thay vì từ đơn lẻ.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-1 text-lg sm:text-xl opacity-80 pr-2">
                      <span title="Anh quốc">🇬🇧</span>
                      <span title="Sách">📚</span>
                      <span title="Ngôi sao">🌟</span>
                    </div>
                  </div>
                </div>
              )
            ) : (
              /* Other pages preview */
              <div className="flex-1 flex flex-col items-center justify-center text-center p-4 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center text-xl font-bold shadow-inner">
                  {currentPage}
                </div>
                <div className="space-y-1 max-w-md">
                  <h3 className="font-bold text-sm text-foreground">
                    {isMath ? `Hoạt động luyện tập bài toán — Trang ${currentPage}` : `Classroom Practice & Activities — Page ${currentPage}`}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {isMath
                      ? 'Giáo viên tương tác cùng học sinh: đếm số, nhận biết vị trí hàng/cột và tìm quy luật dấu chân các con vật Pooka và Wooka.'
                      : 'Students practice listening, repeating vocabulary and role-playing classroom conversations.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge variant="outline" className="text-xs px-2.5 py-0.5 bg-white dark:bg-zinc-800">
                    {isMath ? 'Bảng số 100' : 'Vocabulary Lab'}
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2.5 py-0.5 bg-white dark:bg-zinc-800">
                    {isMath ? 'Phép tách số chục & đơn vị' : 'Sentence Practice'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Bottom slide footer indicator */}
            <div className="pt-1.5 flex items-center justify-between text-xs text-muted-foreground border-t border-zinc-200/60 dark:border-zinc-800/60">
              <span>{isMath ? 'Học phần: Math Kindi · Cấp độ 1' : 'Học phần: IELTS Junior / Cambridge · Level 2'}</span>
              <span className="font-mono font-bold">Slide {currentPage} / {totalPages}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
