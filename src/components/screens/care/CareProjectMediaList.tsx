'use client'

import React, { useState } from 'react'
import { FolderGit2, Image as ImageIcon, Play, Video, ChevronDown, ChevronUp, Share2, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MediaPreviewModal, type MediaPreviewItem } from '@/components/shared'

interface ProjectMediaItem {
  id: string
  type: 'image' | 'video'
  title: string
  url: string
  thumbnailUrl: string
  duration?: string
  caption: string
}

interface ProjectSession {
  id: string
  sessionNumber: number
  date: string
  title: string
  description: string
  evaluator: string
  media: ProjectMediaItem[]
}

interface CareProjectMediaListProps {
  pkgIsEnglish: boolean
}

export function CareProjectMediaList({ pkgIsEnglish }: CareProjectMediaListProps) {
  const [selectedMedia, setSelectedMedia] = useState<ProjectMediaItem | null>(null)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [expandedProjectComments, setExpandedProjectComments] = useState<Record<string, boolean>>({})

  const toggleExpandProjectComment = (id: string) => {
    setExpandedProjectComments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const projectSessions: ProjectSession[] = [
    {
      id: 'proj-1',
      sessionNumber: 14,
      date: '10/07/2026',
      title: pkgIsEnglish
        ? 'Dự án Thuyết trình: My Dream City & Environmental Future'
        : 'Dự án STEM Robotics: Chế tạo Xe tự hành RinoBot',
      description: pkgIsEnglish
        ? 'Học viên tự vẽ sơ đồ thành phố mơ ước và thuyết trình tiếng Anh 3 phút trước lớp.'
        : 'Lắp ráp khung xe 4 bánh, đấu nối cảm biến siêu âm tránh vật cản và nạp code vi điều khiển.',
      evaluator: pkgIsEnglish ? 'Teacher Mark' : 'GV Nguyễn Minh Trí',
      media: [
        {
          id: 'm-1',
          type: 'image',
          title: 'Ảnh sản phẩm xe tự hành hoàn thiện',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
          caption: 'Học viên hoàn thành chạy thử nghiệm xe tự hành trên sa bàn thực hành.',
        },
        {
          id: 'm-2',
          type: 'image',
          title: 'Ảnh học viên lập trình vi điều khiển',
          url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80',
          caption: 'Thực hành canh chỉnh thông số cảm biến khoảng cách.',
        },
        {
          id: 'm-3',
          type: 'video',
          title: 'Video thuyết trình báo cáo sản phẩm',
          url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80',
          duration: '02:15',
          caption: 'Video ghi lại toàn bộ phần thuyết trình báo cáo dự án trước lớp (2 phút 15 giây).',
        },
      ],
    },
    {
      id: 'proj-2',
      sessionNumber: 8,
      date: '12/06/2026',
      title: pkgIsEnglish
        ? 'Dự án Mini-Roleplay: English Customer Support Challenge'
        : 'Dự án STEM Toán học: Thiết kế Mô hình Kiến trúc 3D',
      description: pkgIsEnglish
        ? 'Đóng vai tư vấn viên và khách hàng giải quyết khiếu nại sản phẩm bằng Tiếng Anh.'
        : 'Ứng dụng công thức tính diện tích và thể tích để dựng mô hình nhà thông minh.',
      evaluator: pkgIsEnglish ? 'Teacher Sarah' : 'GV Bùi Văn Anh',
      media: [
        {
          id: 'm-4',
          type: 'image',
          title: 'Ảnh bản vẽ thiết kế mô hình 3D',
          url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80',
          caption: 'Bản vẽ phối cảnh và tính toán thông số tỷ lệ.',
        },
        {
          id: 'm-5',
          type: 'video',
          title: 'Video thực hành làm việc nhóm',
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
          thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
          duration: '01:45',
          caption: 'Video quá trình thảo luận nhóm và cắt dán mô hình.',
        },
      ],
    },
  ]

  const visibleProjects = showAllProjects ? projectSessions : projectSessions.slice(0, 1)

  return (
    <>
      <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 select-none text-left overflow-hidden">
        {/* Header with soft background tint */}
        <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-xs font-bold text-foreground tracking-tight">
            Dự án
          </h3>
          <span className="text-[10px] text-muted-foreground font-normal">
            Hiển thị {visibleProjects.length}/{projectSessions.length} dự án
          </span>
        </div>

        {/* List of Project Sessions */}
        <div className="space-y-4 pt-1">
          {visibleProjects.map((project, idx) => (
            <div
              key={project.id}
              className={cn(
                "space-y-2 text-xs",
                idx > 0 && "pt-3 border-t border-border/30"
              )}
            >
              {/* Dòng 1: Tên dự án & Date header (Thứ highlight, Ngày, Khung giờ) */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h4 className="font-bold text-foreground text-xs truncate leading-snug">
                  {project.title}
                </h4>

                <div className="flex items-center gap-1.5 flex-wrap text-[11px] shrink-0">
                  <span className="font-extrabold text-[10px] px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800 shrink-0 shadow-3xs">
                    Thứ 6
                  </span>
                  <span className="font-semibold text-foreground">
                    {project.date}
                  </span>
                  <span className="text-border/80">•</span>
                  <span className="font-mono text-[10.5px] font-medium text-muted-foreground bg-muted/40 px-1.5 py-0.5 rounded border border-border/50">
                    17:30 - 19:00
                  </span>
                </div>
              </div>

              {/* Dòng 1.5: Nhận xét của học sinh (3 dòng text + Xem thêm dưới dòng) */}
              {project.description && (
                <div className="pt-1 pb-0.5 space-y-1">
                  <p
                    className={cn(
                      'text-[11px] text-slate-900 dark:text-zinc-100 font-normal leading-relaxed',
                      !expandedProjectComments[project.id] && 'line-clamp-3'
                    )}
                  >
                    {project.description}
                  </p>
                  {project.description.length > 60 && (
                    <div className="flex justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={() => toggleExpandProjectComment(project.id)}
                        className="text-[10.5px] text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-0.5 cursor-pointer font-semibold transition-colors"
                      >
                        <span>{expandedProjectComments[project.id] ? 'Thu gọn' : 'Xem thêm'}</span>
                        {expandedProjectComments[project.id] ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Dòng 2: Liệt kê danh sách ảnh / video media trực tiếp */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-0.5">
                {project.media.map((mediaItem) => (
                  <div
                    key={mediaItem.id}
                    onClick={() => setSelectedMedia(mediaItem)}
                    className="group relative rounded-lg border border-border/60 overflow-hidden bg-zinc-900 cursor-pointer shadow-3xs hover:border-sky-500 transition-all aspect-video flex flex-col justify-end p-1.5"
                  >
                    {/* Image background */}
                    <img
                      src={mediaItem.thumbnailUrl}
                      alt={mediaItem.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Share / Copy Link button on hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigator.clipboard.writeText(mediaItem.url)
                          .then(() => toast.success(`Đã sao chép liên kết ${mediaItem.type === 'video' ? 'video' : 'hình ảnh'} (Copy thành công!)`))
                          .catch(() => toast.error('Không thể sao chép liên kết.'))
                      }}
                      className="absolute top-1.5 left-1.5 z-20 p-1.5 rounded-md bg-black/70 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
                      title="Sao chép liên kết (Copy thành công)"
                    >
                      <Share2 className="h-3 w-3" />
                      <span className="text-[9.5px] font-medium hidden sm:inline">Sao chép link</span>
                    </button>

                    {/* Icon type overlay */}
                    {mediaItem.type === 'video' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <Play className="h-4 w-4 ml-0.5 fill-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/50 text-white">
                        <ImageIcon className="h-3 w-3" />
                      </div>
                    )}

                    {/* Bottom title & duration */}
                    <div className="relative z-10 text-[10px] text-white font-medium truncate leading-tight">
                      {mediaItem.type === 'video' && (
                        <span className="bg-sky-600 px-1 rounded text-[9px] font-mono mr-1">
                          {mediaItem.duration}
                        </span>
                      )}
                      {mediaItem.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Button xem thêm lịch sử các dự án khác */}
        {projectSessions.length > 1 && (
          <div className="pt-2 text-center border-t border-border/40">
            <button
              type="button"
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted/30 hover:bg-muted/60 text-foreground border border-border/60 transition-all cursor-pointer shadow-3xs"
            >
              <span>
                {showAllProjects
                  ? 'Thu gọn lịch sử dự án'
                  : `Xem thêm lịch sử dự án khác (${projectSessions.length - 1} dự án cũ hơn)`}
              </span>
              {showAllProjects ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* Media Lightbox Preview Modal (Shared Component) */}
      <MediaPreviewModal
        previewMedia={
          selectedMedia
            ? {
                name: selectedMedia.title,
                url: selectedMedia.url,
                thumbnailUrl: selectedMedia.thumbnailUrl || selectedMedia.url,
                type: selectedMedia.type,
              }
            : null
        }
        onClose={() => setSelectedMedia(null)}
      />
    </>
  )
}
