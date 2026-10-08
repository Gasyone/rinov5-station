'use client'

import React, { useState, useMemo } from 'react'
import {
  Play,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MediaPreviewModal } from '@/components/shared'
import { getShortDayOfWeek, formatDateNoYear } from './careSessionTimelineHelpers'

interface ProjectMediaItem {
  id: string
  type: 'image' | 'video'
  title: string
  url: string
  thumbnailUrl: string
  duration?: string
  caption: string
  taggedStudentIds?: string[] // Empty array = "Cả lớp"
  isTaggedForStudent?: boolean
  tagLabel?: 'Ảnh riêng của con' | 'Ảnh chung cả lớp'
}

interface ProjectSession {
  id: string
  sessionNumber: number
  date: string
  timeStr?: string
  dayOfWeek?: string
  title: string
  description: string
  evaluator: string
  media: ProjectMediaItem[]
}

interface CareProjectMediaListProps {
  pkgIsEnglish: boolean
  studentId?: string
  studentName?: string
  classCode?: string
  className?: string
}

export function CareProjectMediaList({
  pkgIsEnglish,
  studentId = 'HV-S4-10',
  studentName = 'Học viên',
}: CareProjectMediaListProps) {
  const [selectedMedia, setSelectedMedia] = useState<ProjectMediaItem | null>(null)
  const [showAllProjects, setShowAllProjects] = useState(false)
  const [expandedProjectComments, setExpandedProjectComments] = useState<Record<string, boolean>>({})

  const isProjectCommentExpanded = (id: string, idx: number) => {
    if (expandedProjectComments[id] !== undefined) {
      return expandedProjectComments[id]
    }
    return idx === 0 // Buổi gần nhất luôn mở rộng
  }

  const toggleExpandProject = (id: string, idx: number) => {
    setExpandedProjectComments((prev) => ({
      ...prev,
      [id]: !isProjectCommentExpanded(id, idx),
    }))
  }

  // Raw mock media database for project sessions
  const rawProjectSessions: ProjectSession[] = useMemo(() => {
    if (pkgIsEnglish) {
      return [
        {
          id: 'proj-eng-1',
          sessionNumber: 14,
          date: '10/07/2026',
          dayOfWeek: 'Thứ 6',
          timeStr: '17:30 - 19:00',
          title: 'Dự án Thuyết trình: My Dream City & Environmental Future',
          description: `Học viên tự vẽ sơ đồ thành phố mơ ước và thuyết trình tiếng Anh 3 phút trước lớp. Con ${studentName} thể hiện phản xạ từ vựng rất ấn tượng, phát âm rõ ràng các chủ đề về môi trường.`,
          evaluator: 'Teacher Mark & Ms.Chloe',
          media: [
            {
              id: 'm-eng-1',
              type: 'image',
              title: 'Ảnh sơ đồ sa bàn thành phố tương lai',
              url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
              caption: 'Sa bàn tổng hợp thành phố xanh do cả nhóm cùng thiết kế và phối màu.',
              taggedStudentIds: [], // Cả lớp
            },
            {
              id: 'm-eng-2',
              type: 'video',
              title: `Video thuyết trình tiếng Anh của ${studentName}`,
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=300&q=80',
              duration: '02:15',
              caption: `Video ghi hình bài thuyết trình tự tin của con ${studentName} trước lớp (2 phút 15 giây).`,
              taggedStudentIds: [studentId, 's-baohan', 's-phuc', 's1', 's13'], // Gán nhãn học viên
            },
            {
              id: 'm-eng-3',
              type: 'image',
              title: `Ảnh ${studentName} nhận chứng nhận xuất sắc`,
              url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
              caption: `Khoảnh khắc tuyên dương và trao chứng nhận dự án cho ${studentName}.`,
              taggedStudentIds: [studentId, 's-baohan', 's-phuc', 's1', 's13'],
            },
            {
              id: 'm-eng-4',
              type: 'image',
              title: 'Ảnh tập thể lớp thảo luận nhóm',
              url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80',
              caption: 'Các bạn học sinh cùng trao đổi và hỗ trợ nhau hoàn thiện dự án.',
              taggedStudentIds: [], // Cả lớp
            },
            {
              id: 'm-eng-other',
              type: 'video',
              title: 'Video thuyết trình bạn khác',
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
              duration: '01:30',
              caption: 'Video của học viên khác (sẽ được tự động ẩn).',
              taggedStudentIds: ['other-student-only'], // Không gán cho học viên này -> bị lọc
            },
          ],
        },
        {
          id: 'proj-eng-2',
          sessionNumber: 8,
          date: '12/06/2026',
          dayOfWeek: 'Thứ 6',
          timeStr: '17:30 - 19:00',
          title: 'Dự án Mini-Roleplay: English Customer Support Challenge',
          description: `Đóng vai tư vấn viên và khách hàng giải quyết khiếu nại sản phẩm bằng Tiếng Anh. Con vận dụng phản xạ ngữ điệu tự nhiên và giao tiếp linh hoạt.`,
          evaluator: 'Teacher Sarah & Ms.Chloe',
          media: [
            {
              id: 'm-eng-5',
              type: 'image',
              title: 'Ảnh đạo cụ & bối cảnh roleplay',
              url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80',
              caption: 'Bối cảnh quầy thông tin dịch vụ khách hàng.',
              taggedStudentIds: [],
            },
            {
              id: 'm-eng-6',
              type: 'video',
              title: `Video đóng vai thực tế của ${studentName}`,
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
              duration: '01:45',
              caption: `Video xử lý tình huống giao tiếp trôi chảy của con ${studentName}.`,
              taggedStudentIds: [studentId, 's-baohan', 's-phuc', 's1', 's13'],
            },
            {
              id: 'm-eng-7',
              type: 'image',
              title: 'Ảnh lưu niệm cả lớp bế mạc dự án',
              url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=300&q=80',
              caption: 'Bức ảnh chụp chung toàn bộ lớp học sau khi hoàn thành buổi dự án số 8.',
              taggedStudentIds: [],
            },
          ],
        },
      ]
    } else {
      // Math / STEM Classes
      return [
        {
          id: 'proj-math-1',
          sessionNumber: 14,
          date: '10/07/2026',
          dayOfWeek: 'Thứ 3',
          timeStr: '18:00 - 19:30',
          title: 'Dự án STEM Robotics: Chế tạo Xe tự hành RinoBot',
          description: `Lắp ráp khung xe 4 bánh, đấu nối cảm biến siêu âm tránh vật cản và nạp code vi điều khiển. Con ${studentName} tính toán khoảng cách phản hồi rất chuẩn xác.`,
          evaluator: 'GV. Nguyễn Minh Trí',
          media: [
            {
              id: 'm-math-1',
              type: 'image',
              title: 'Ảnh sa bàn thử nghiệm xe tự hành',
              url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80',
              caption: 'Sa bàn chướng ngại vật để kiểm tra độ nhạy của cảm biến siêu âm.',
              taggedStudentIds: [],
            },
            {
              id: 'm-math-2',
              type: 'video',
              title: `Video ${studentName} nạp code và chạy thử xe`,
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=300&q=80',
              duration: '02:05',
              caption: `Xe tự hành của ${studentName} vượt qua mọi khúc cua mượt mà, dừng đúng vạch đích.`,
              taggedStudentIds: [studentId, 's-baohan', 's-phuc', 's1', 's13'],
            },
            {
              id: 'm-math-3',
              type: 'image',
              title: `Ảnh ${studentName} lập trình vi điều khiển`,
              url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
              caption: `Tập trung cao độ khi viết vòng lặp điều khiển motor bánh xe.`,
              taggedStudentIds: [studentId, 's-baohan', 's-phuc', 's1', 's13'],
            },
            {
              id: 'm-math-4',
              type: 'image',
              title: 'Ảnh tập thể lớp cùng các sản phẩm robot',
              url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
              caption: 'Buổi nghiệm thu dự án thành công rực rỡ cùng các bạn trong lớp.',
              taggedStudentIds: [],
            },
          ],
        },
        {
          id: 'proj-math-2',
          sessionNumber: 8,
          date: '12/06/2026',
          dayOfWeek: 'Thứ 3',
          timeStr: '18:00 - 19:30',
          title: 'Dự án STEM Toán học: Thiết kế Mô hình Kiến trúc 3D',
          description: `Ứng dụng công thức tính diện tích và thể tích để dựng mô hình nhà thông minh. Con thể hiện tư duy hình học không gian vượt trội.`,
          evaluator: 'GV. Bùi Văn Anh',
          media: [
            {
              id: 'm-math-5',
              type: 'image',
              title: 'Ảnh bản vẽ thiết kế mô hình 3D',
              url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=300&q=80',
              caption: 'Bản vẽ phối cảnh và tính toán tỷ lệ thể tích phòng ốc.',
              taggedStudentIds: [],
            },
            {
              id: 'm-math-6',
              type: 'video',
              title: `Video ${studentName} thuyết minh kiến trúc`,
              url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
              thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80',
              duration: '01:40',
              caption: `Con giải thích cặn kẽ công thức tính diện tích mái che và dung tích bể chứa.`,
              taggedStudentIds: [studentId, 's-baohan', 's-phuc', 's1', 's13'],
            },
            {
              id: 'm-math-7',
              type: 'image',
              title: 'Ảnh toàn thể các tác phẩm mô hình của lớp',
              url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
              thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=300&q=80',
              caption: 'Góc trưng bày sản phẩm kiến trúc thu nhỏ của các học viên.',
              taggedStudentIds: [],
            },
          ],
        },
      ]
    }
  }, [pkgIsEnglish, studentId, studentName])

  // Process and filter media according to business rule:
  // Show: (1) General class media (taggedStudentIds is empty)
  //   OR: (2) Media tagged with this student (taggedStudentIds contains studentId or alias)
  // Hide: Media tagged ONLY for other students
  const filteredProjectSessions = useMemo(() => {
    return rawProjectSessions.map((session) => {
      const allowedMedia: ProjectMediaItem[] = []

      session.media.forEach((item) => {
        const isClassWide = !item.taggedStudentIds || item.taggedStudentIds.length === 0
        const isTagged =
          !isClassWide &&
          (item.taggedStudentIds?.includes(studentId) ||
            item.taggedStudentIds?.some((id) => id.includes(studentId) || studentId.includes(id)))

        // Only include if it's class-wide OR tagged for this student
        if (isClassWide || isTagged) {
          allowedMedia.push({
            ...item,
            isTaggedForStudent: isTagged,
            tagLabel: isTagged ? 'Ảnh riêng của con' : 'Ảnh chung cả lớp',
          })
        }
      })

      return {
        ...session,
        media: allowedMedia,
      }
    })
  }, [rawProjectSessions, studentId])

  const visibleProjects = showAllProjects
    ? filteredProjectSessions
    : filteredProjectSessions.slice(0, 1)

  return (
    <>
      <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-xl p-2.5 shadow-2xs space-y-2 select-none text-left overflow-hidden">
        {/* Header with soft background tint */}
        <div className="-mx-2.5 -mt-2.5 py-1.5 px-3 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <div>
            <h3 className="text-xs font-semibold text-foreground tracking-tight">
              Buổi học dự án & thực hành
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-muted-foreground font-normal">
              Hiển thị {visibleProjects.length}/{filteredProjectSessions.length} buổi dự án
            </span>
            {filteredProjectSessions.length > 1 && (
              <>
                <span className="text-border/80">•</span>
                <button
                  type="button"
                  onClick={() => setShowAllProjects(!showAllProjects)}
                  className="inline-flex items-center gap-1 text-[11px] font-normal text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                >
                  <span>
                    {showAllProjects ? 'Thu gọn' : `Xem thêm (${filteredProjectSessions.length - 1} buổi)`}
                  </span>
                  {showAllProjects ? (
                    <ChevronUp className="h-3 w-3 text-muted-foreground stroke-[1.5]" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-muted-foreground stroke-[1.5]" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* List of Project Sessions */}
        <div className="space-y-1.5 pt-0.5">
          {visibleProjects.map((project, idx) => {
            const shortDay = project.dayOfWeek ? getShortDayOfWeek(project.dayOfWeek) : getShortDayOfWeek(project.date)
            const shortDate = formatDateNoYear(project.date)
            const firstMedia = project.media[0] || null
            const isProjectExpanded = isProjectCommentExpanded(project.id, idx)

            return (
              <div
                key={project.id || idx}
                className="p-2 sm:px-2.5 rounded-lg border border-border/50 bg-muted/15 dark:bg-zinc-800/25 hover:bg-muted/30 hover:border-border/80 transition-colors text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  {/* Cụm trái: [Thứ, Ngày/Tháng] + Tên dự án (truncate) - Bỏ giáo viên */}
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 shrink-0">
                      {shortDay}, {shortDate}
                    </span>

                    <span
                      className="font-normal text-foreground text-xs truncate min-w-0"
                      title={project.title}
                    >
                      {project.title}
                    </span>
                  </div>

                  {/* Cụm phải: Nút Sao chép link */}
                  {firstMedia?.url && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard
                          .writeText(firstMedia.url)
                          .then(() => toast.success(`Đã sao chép liên kết media buổi dự án!`))
                          .catch(() => toast.error('Không thể sao chép liên kết.'))
                      }}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer shrink-0"
                      title="Sao chép liên kết media dự án"
                    >
                      <Copy className="h-3 w-3 stroke-[1.5]" />
                    </Button>
                  )}
                </div>

                {/* Nội dung nhận xét / mô tả buổi dự án (Thu gọn tối đa 3 dòng, buổi gần nhất mở rộng) */}
                {project.description && (
                  <div className="relative pt-0.5">
                    <p
                      className={cn(
                        'text-xs text-foreground/90 font-normal leading-relaxed cursor-pointer',
                        !isProjectExpanded ? 'line-clamp-3 pr-20' : 'pr-20'
                      )}
                      onClick={() => toggleExpandProject(project.id, idx)}
                    >
                      {project.description}
                    </p>
                    {project.description.length > 60 && (
                      <button
                        type="button"
                        onClick={() => toggleExpandProject(project.id, idx)}
                        className="absolute bottom-0 right-0 text-[10.5px] italic text-sky-600 dark:text-sky-400 hover:underline cursor-pointer bg-card dark:bg-zinc-900 pl-1 leading-relaxed inline-flex items-center gap-0.5"
                      >
                        <span>{isProjectExpanded ? '... Thu gọn' : '... xem thêm'}</span>
                      </button>
                    )}
                  </div>
                )}

                {/* Vẫn hiển thị ảnh / video trực tiếp bên dưới */}
                {project.media.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    {project.media.map((mediaItem) => (
                      <div
                        key={mediaItem.id}
                        onClick={() => setSelectedMedia(mediaItem)}
                        className={cn(
                          'group relative rounded-md border overflow-hidden bg-zinc-900 cursor-pointer shadow-3xs transition-all aspect-video flex flex-col justify-end p-1.5',
                          mediaItem.isTaggedForStudent
                            ? 'border-emerald-500/80 hover:border-emerald-400'
                            : 'border-border/60 hover:border-sky-500'
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={mediaItem.thumbnailUrl}
                          alt={mediaItem.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Play icon if video */}
                        {mediaItem.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="h-6 w-6 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                              <Play className="h-3 w-3 ml-0.5 fill-white" />
                            </div>
                          </div>
                        )}

                        {/* Title & duration */}
                        <div className="relative z-10 text-[10.5px] text-white font-normal truncate leading-tight">
                          {mediaItem.type === 'video' && (
                            <span className="bg-sky-600 px-1 rounded text-[10px] font-mono mr-1">
                              {mediaItem.duration}
                            </span>
                          )}
                          {mediaItem.title}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Media Lightbox Preview Modal */}
      <MediaPreviewModal
        previewMedia={
          selectedMedia
            ? {
                name: selectedMedia.title,
                url: selectedMedia.url,
                thumbnailUrl: selectedMedia.thumbnailUrl || selectedMedia.url,
                type: selectedMedia.type,
                duration: selectedMedia.duration,
                taggedStudents: selectedMedia.isTaggedForStudent
                  ? [
                      {
                        id: studentId,
                        name: studentName,
                        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(studentName)}`,
                      },
                    ]
                  : [],
              }
            : null
        }
        onClose={() => setSelectedMedia(null)}
      />
    </>
  )
}

