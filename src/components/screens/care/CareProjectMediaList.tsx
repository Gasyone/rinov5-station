'use client'

import React, { useState, useMemo } from 'react'
import {
  Play,
  ChevronDown,
  ChevronUp,
  Share2,
  Users,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MediaPreviewModal, PersonnelHoverCard } from '@/components/shared'
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

  const isProjectCommentExpanded = (id: string) => {
    if (expandedProjectComments[id] !== undefined) {
      return expandedProjectComments[id]
    }
    return id === 'proj-math-1' || id === 'proj-eng-1'
  }

  const toggleExpandProjectComment = (id: string) => {
    setExpandedProjectComments((prev) => ({
      ...prev,
      [id]: !isProjectCommentExpanded(id),
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
      <div className="bg-card dark:bg-zinc-900 border border-border/80 rounded-2xl p-4 shadow-2xs space-y-3.5 select-none text-left overflow-hidden">
        {/* Header with soft background tint */}
        <div className="-mx-4 -mt-4 py-2 px-4 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-2.5">
          <h3 className="text-xs font-bold text-foreground tracking-tight">
            Buổi Học Dự Án & Media Thực Hành
          </h3>
        </div>

        {/* List of Project Sessions */}
        <div className="space-y-4 pt-1">
          {visibleProjects.map((project, idx) => {
            const shortDay = project.dayOfWeek ? getShortDayOfWeek(project.dayOfWeek) : getShortDayOfWeek(project.date)
            const shortDate = formatDateNoYear(project.date)

            return (
              <div
                key={project.id}
                className={cn(
                  'space-y-2.5 text-xs',
                  idx > 0 && 'pt-3 border-t border-border/30'
                )}
              >
                {/* Row 1: [Thứ, Ngày/Tháng] + Tên dự án | GV: [Tên] • Project */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  {/* Cụm trái: [Thứ, Ngày/Tháng] + Tên buổi dự án */}
                  <div className="flex items-center gap-1.5 min-w-0 flex-1">
                    <span className="font-semibold text-xs shrink-0 text-sky-600 dark:text-sky-400">
                      {shortDay}, {shortDate}
                    </span>
                    <h4
                      className="font-normal text-foreground text-xs truncate leading-snug min-w-0"
                      title={project.title}
                    >
                      {project.title}
                    </h4>
                  </div>

                  {/* Cụm phải: GV (+hover card) */}
                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-muted-foreground whitespace-nowrap ml-auto">
                    <span className="text-muted-foreground">GV:</span>
                    <PersonnelHoverCard
                      person={{
                        id: `EMP-${project.id}`,
                        name: project.evaluator || 'Teacher Mark',
                        role: 'Giáo viên phụ trách',
                        phone: '0901234567',
                        email: 'teacher@rinoedu.com',
                        avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=TeacherMark',
                      }}
                      align="end"
                    >
                      <span className="font-normal text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-sky-400 hover:underline cursor-pointer transition-colors">
                        {project.evaluator}
                      </span>
                    </PersonnelHoverCard>
                  </div>
                </div>

                {/* Row 1.5: Nhận xét đánh giá dự án */}
                {project.description && (
                  <div className="p-2.5 rounded-lg bg-muted/20 border border-border/40 space-y-1">
                    <p
                      className={cn(
                        'text-xs text-foreground/90 font-normal leading-relaxed',
                        !isProjectCommentExpanded(project.id) && 'line-clamp-2'
                      )}
                    >
                      {project.description}
                    </p>
                  {project.description.length > 80 && (
                    <div className="flex justify-end pt-0.5">
                      <button
                        type="button"
                        onClick={() => toggleExpandProjectComment(project.id)}
                        className="text-[10.5px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer font-semibold transition-colors"
                      >
                        <span>{isProjectCommentExpanded(project.id) ? 'Thu gọn' : 'Xem thêm nhận xét'}</span>
                        {isProjectCommentExpanded(project.id) ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Row 2: Grid media ảnh / video */}
              {project.media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-0.5">
                  {project.media.map((mediaItem) => (
                    <div
                      key={mediaItem.id}
                      onClick={() => setSelectedMedia(mediaItem)}
                      className={cn(
                        'group relative rounded-lg border overflow-hidden bg-zinc-900 cursor-pointer shadow-3xs transition-all aspect-video flex flex-col justify-end p-2',
                        mediaItem.isTaggedForStudent
                          ? 'border-emerald-500/80 hover:border-emerald-400 hover:ring-1 hover:ring-emerald-400'
                          : 'border-border/60 hover:border-sky-500'
                      )}
                    >
                      {/* Image background */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={mediaItem.thumbnailUrl}
                        alt={mediaItem.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

                      {/* Top Left: Tag Badge (Ảnh riêng của con vs Chung cả lớp) */}
                      <div className="absolute top-1.5 left-1.5 z-20 flex items-center gap-1">
                        {mediaItem.isTaggedForStudent ? (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-emerald-600 text-white shadow-xs">
                            <UserCheck className="h-2.5 w-2.5" />
                            <span>Ảnh của con</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9.5px] font-medium bg-black/60 text-white/90 backdrop-blur-xs">
                            <Users className="h-2.5 w-2.5" />
                            <span>Cả lớp</span>
                          </span>
                        )}
                      </div>

                      {/* Share / Copy Link button on hover */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard
                            .writeText(mediaItem.url)
                            .then(() =>
                              toast.success(
                                `Đã sao chép liên kết ${mediaItem.type === 'video' ? 'video' : 'hình ảnh'}!`
                              )
                            )
                            .catch(() => toast.error('Không thể sao chép liên kết.'))
                        }}
                        className="absolute top-1.5 right-1.5 z-20 p-1.5 rounded-md bg-black/70 hover:bg-black text-white opacity-0 group-hover:opacity-100 transition-all cursor-pointer flex items-center gap-1 shadow-md hover:scale-105"
                        title="Sao chép liên kết ảnh/video gửi phụ huynh"
                      >
                        <Share2 className="h-3 w-3" />
                      </button>

                      {/* Center Play Icon for Video */}
                      {mediaItem.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="h-8 w-8 rounded-full bg-sky-600/90 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                            <Play className="h-4 w-4 ml-0.5 fill-white" />
                          </div>
                        </div>
                      )}

                      {/* Bottom title & duration */}
                      <div className="relative z-10 text-[11px] text-white font-medium truncate leading-tight">
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
              ) : (
                <div className="py-4 text-center text-muted-foreground italic text-xs bg-muted/10 rounded-lg border border-dashed border-border/50">
                  Không có hình ảnh/video nào phù hợp với bộ lọc đã chọn.
                </div>
              )}
            </div>
            )
          })}
        </div>

        {/* Button xem thêm lịch sử các dự án khác */}
        {filteredProjectSessions.length > 1 && (
          <div className="pt-2 text-center border-t border-border/40">
            <button
              type="button"
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-muted/30 hover:bg-muted/60 text-foreground border border-border/60 transition-all cursor-pointer shadow-3xs"
            >
              <span>
                {showAllProjects
                  ? 'Thu gọn lịch sử dự án'
                  : `Xem thêm lịch sử dự án khác (${filteredProjectSessions.length - 1} dự án cũ hơn)`}
              </span>
              {showAllProjects ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        )}
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
              }
            : null
        }
        onClose={() => setSelectedMedia(null)}
      />
    </>
  )
}

