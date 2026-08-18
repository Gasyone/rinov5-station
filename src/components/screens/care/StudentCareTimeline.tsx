'use client'

import React, { useState, useMemo } from 'react'
import { AlertTriangle, Calendar, ChevronDown, ChevronUp, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { AudioPlayButton } from './AudioPlayButton'
import {
  parseRecipient,
  parseLogTopic,
  cleanMessageNotes,
  formatRelativeDate,
  type MergedTimelineItem,
} from './studentCareDetailHelpers'
import { type CareInteractionLog, type StudentCareAlert } from '@/mocks/careAlerts'
import { isCared, formatFullStaffName } from './operationsAlertHelpers'
import { CareTagHoverCard } from '@/components/shared'
import { HistoryLogCardItem } from './HistoryLogCardItem'
import { CareJourneyMilestoneCard } from './CareJourneyMilestoneCard'

function parseCareTagsFromLog(log: CareInteractionLog) {
  const tags: { code: string; label: string; description?: string }[] = []
  const notes = log.notes || ''

  const bracketMatches = notes.match(/\[([A-Z0-9]{2,6}-[0-9]{2}[^\]]*)\]/gi)
  if (bracketMatches) {
    bracketMatches.forEach((m) => {
      const clean = m.replace(/^\[|\]$/g, '').trim()
      if (
        !clean.includes('Thời gian hẹn') &&
        !clean.includes('Phụ huynh') &&
        !clean.includes('Lần chăm sóc')
      ) {
        const parts = clean.split(':')
        const code = parts[0].trim()
        const label = clean
        tags.push({ code, label })
      }
    })
  }

  if (tags.length === 0) {
    const text = notes.toLowerCase()
    if (text.includes('bài tập') || text.includes('điểm') || text.includes('học tập')) {
      tags.push({ code: 'HT-01', label: 'HT-01 : Điểm kiểm tra dưới chuẩn' })
    } else if (text.includes('nghỉ') || text.includes('chuyên cần')) {
      tags.push({ code: 'CC-01', label: 'CC-01 : Nghỉ 2 buổi liên tiếp' })
    } else if (text.includes('phí') || text.includes('gói học') || text.includes('tái phí')) {
      tags.push({ code: 'HP-01', label: 'HP-01 : Nhắc nộp phí khóa mới' })
    }
  }

  return tags
}

interface StudentCareTimelineProps {
  student?: StudentCareAlert
  filteredCombinedLogs: MergedTimelineItem[]
  stickyTopOffset?: number
}

interface RoadmapMilestone {
  id: string
  code: string
  title: string
  roleOwner: 'CS PHỤ TRÁCH' | 'GV PHỤ TRÁCH' | 'SALE PHỤ TRÁCH'
  status: 'completed' | 'overdue' | 'future' | 'in_progress'
  date: string
  subtext: string
  historyCount?: number
  historyLogs?: {
    date: string
    staffName: string
    channel: string
    note: string
    quote?: string
  }[]
}

export function StudentCareTimeline({
  student,
  filteredCombinedLogs,
  stickyTopOffset = 160,
}: StudentCareTimelineProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'roadmap'>('history')
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all')
  const [showAllSubjects, setShowAllSubjects] = useState<boolean>(false)
  const [showMissedCalls, setShowMissedCalls] = useState(false)
  const [showHistoryItem1MissedCalls, setShowHistoryItem1MissedCalls] = useState(false)
  const [expandedLogMissedCalls, setExpandedLogMissedCalls] = useState<Record<string, boolean>>({})
  const [expandedCardKeys, setExpandedCardKeys] = useState<Record<string, boolean>>({})
  const [expandedRoadmapIds, setExpandedRoadmapIds] = useState<string[]>([])

  const toggleRoadmapExpand = (id: string) => {
    setExpandedRoadmapIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const toggleCardExpand = (key: string) => {
    setExpandedCardKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Calculate counts
  const totalHistoryCount = (filteredCombinedLogs.length || 0) + 4 // 1 active + 3 mock past + dynamic logs

  // Mock Roadmap Milestones matching Screenshot 2 exactly
  const roadmapMilestones: RoadmapMilestone[] = [
    {
      id: 'm1',
      code: 'TH-01',
      title: 'Prestudy (Trước khai giảng)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '01/07/2026',
      subtext: 'Xác nhận thông tin & nhận lớp',
      historyCount: 1,
      historyLogs: [
        {
          date: '01/07/2026 09:30',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
          note: 'Xác nhận lại lịch học, quy định lớp học và gửi link lớp Zalo cho phụ huynh.',
          quote: '“Bố đã nhận được thông tin và sẽ chuẩn bị cho con tham gia buổi đầu đúng giờ.”'
        }
      ]
    },
    {
      id: 'm2',
      code: 'TH-02',
      title: 'Buổi 1-2 (Hòa nhập ban đầu)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '05/07/2026',
      subtext: 'Hỏi thăm trải nghiệm đầu tiên',
      historyCount: 1,
      historyLogs: [
        {
          date: '05/07/2026 15:30',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Cuộc gọi: Châu Mẹ Nguyễn Thị Mai (Mẹ)',
          note: 'Hỏi thăm tình hình học sinh 2 buổi đầu tiên. Học viên hòa nhập tốt với các bạn và tích cực phát biểu.',
          quote: '“Bé về nhà rất hào hứng khen lớp học vui và cô giáo giảng bài dễ hiểu.”'
        }
      ]
    },
    {
      id: 'm3',
      code: 'ĐX-01',
      title: 'Chăm sóc Đột xuất (Hỏi xe đưa đón & ngoại khóa)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '15/07/2026 09:30',
      subtext: 'Phát sinh ngoài mốc',
      historyCount: 1,
      historyLogs: [
        {
          date: '15/07/2026 09:30',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Zalo: Trần Thị Phương (Mẹ)',
          note: 'Hướng dẫn mẹ đăng ký tuyến xe đưa đón điểm trường Cơ sở 1 và các hoạt động ngoại khóa tháng 7.',
          quote: '“Cảm ơn cô, mẹ đã gửi form đăng ký xe bus cho bé rồi nhé.”'
        }
      ]
    },
    {
      id: 'm4',
      code: 'ĐK-01',
      title: 'Báo cáo Chăm sóc Tháng 7/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'overdue',
      date: '25/07/2026',
      subtext: 'Đánh giá thái độ & chuyên cần',
      historyCount: 2,
      historyLogs: [
        {
          date: '20/07/2026 14:00',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
          note: 'Trao đổi về tình hình nghỉ học 2 buổi liên tiếp và điểm thi giảm sút',
          quote: '“Bố bận việc gia đình, xin bảo lưu kết quả 1 tháng để con về quê giải quyết việc”'
        },
        {
          date: '19/07/2026 17:30',
          staffName: 'Hoàng Thị Mai (GV)',
          channel: 'Zalo: Trần Thị Phương (Mẹ)',
          note: 'Giáo viên chủ nhiệm trao đổi tinh hình bài tập Buổi 14 & hướng dẫn con ôn tập',
          quote: '“Mẹ cảm ơn cô giáo đã nhắc nhở, sẽ cho con làm lại bài tập 14 trong tối nay”'
        }
      ]
    },
    {
      id: 'm5',
      code: 'ĐK-02',
      title: 'Báo cáo Chăm sóc Tháng 8/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '25/08/2026',
      subtext: 'Báo cáo định kỳ tháng 8'
    },
    {
      id: 'm6',
      code: 'TH-03',
      title: 'Mini Project 1 (Dự án bài học)',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '15/09/2026',
      subtext: 'Gửi video & nhận xét sản phẩm 1'
    }
  ]

  const isCaredStatus = student ? isCared(student) : false

  const processedRoadmapMilestones = useMemo(() => {
    return roadmapMilestones.map((item) => {
      if (isCaredStatus && item.status === 'overdue') {
        return {
          ...item,
          status: 'completed' as const,
        }
      }
      return item
    })
  }, [roadmapMilestones, isCaredStatus])

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-border/60 p-3.5 shadow-2xs text-left">
      <div 
        className="-mx-3.5 -mt-3.5 py-1.5 px-3.5 bg-muted/40 dark:bg-zinc-800/50 border-b border-border/50 flex items-center justify-between gap-2 mb-1 select-none shrink-0 flex-wrap rounded-t-2xl"
      >
        <div className="flex items-center gap-3 text-xs flex-wrap">
          {/* Lọc Vai trò phụ trách */}
          <div className="flex items-center gap-1">
            <span className="font-bold text-muted-foreground uppercase text-[9.5px]">LỌC:</span>
            <select
              value={staffRoleFilter}
              onChange={(e) => setStaffRoleFilter(e.target.value)}
              className="h-6 text-[11px] bg-white dark:bg-zinc-900 border border-border/80 rounded-md px-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium text-foreground cursor-pointer shadow-3xs"
            >
              <option value="all">Tất cả</option>
              <option value="cskh">CS</option>
              <option value="gv">GV</option>
            </select>
          </div>

          {/* Checkbox Tất cả môn học (Đưa ra sau Lọc Tất cả, mặc định unchecked không hiện TO/TA) */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] font-medium text-foreground hover:text-primary transition-colors">
            <input
              type="checkbox"
              checked={showAllSubjects}
              onChange={(e) => setShowAllSubjects(e.target.checked)}
              className="h-3.5 w-3.5 rounded border-border/80 text-primary focus:ring-primary accent-primary cursor-pointer"
            />
            <span>Tất cả môn</span>
          </label>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('history')}
            className={cn(
              'h-6 text-[11px] font-semibold px-2.5 rounded-md cursor-pointer transition-colors shadow-3xs',
              activeTab === 'history'
                ? 'bg-amber-100/90 text-amber-900 border border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 font-bold'
                : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground border border-border/80'
            )}
          >
            Lịch sử ({totalHistoryCount})
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('roadmap')}
            className={cn(
              'h-6 text-[11px] font-semibold px-2.5 rounded-md cursor-pointer transition-colors shadow-3xs',
              activeTab === 'roadmap'
                ? 'bg-sky-100/90 text-sky-900 border border-sky-300 dark:bg-sky-950 dark:text-sky-300 dark:border-sky-800 font-bold'
                : 'bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-foreground border border-border/80'
            )}
          >
            Mốc chăm sóc
          </Button>
        </div>
      </div>

      <div className="space-y-4 pt-3 pr-0.5">
        {activeTab === 'history' ? (
          <>
            <div className="space-y-3 pt-0.5">
              {(staffRoleFilter === 'all' || staffRoleFilter === 'gv') && (showAllSubjects || student?.subject !== 'Toán tư duy') && (
                <HistoryLogCardItem
                  log={{
                    id: 'gv-log-01',
                    date: '2026-07-05',
                    staffName: 'Hoàng Thị Mai',
                    callConfirmation: 'Đã gọi',
                    notes: '[HT-01] Giáo viên chủ nhiệm trao đổi tình hình bài tập Buổi 14 & hướng dẫn con ôn tập',
                    parentOpinion: 'Mẹ cảm ơn cô giáo đã nhắc nhở, sẽ cho con làm lại bài tập 14 trong tối nay',
                    audioDuration: '01:15',
                    missedCallsList: [
                      {
                        time: '17/07 14:00',
                        status: 'Gọi KNM (Không nghe máy)',
                        nextCallback: '18/07 09:00',
                        note: 'Thuê bao không liên lạc được, thử lại sau',
                      },
                    ],
                  }}
                  topic="HT-01"
                  recipient="Châu Mẹ Nguyễn Thị Mai (Mẹ)"
                  cleanNotes="Giáo viên chủ nhiệm trao đổi tình hình bài tập Buổi 14 & hướng dẫn con ôn tập"
                  staffRole="GV"
                  staffName="Hoàng Thị Mai"
                  date="2026-07-05"
                  subject="Tiếng Anh"
                  showSubjectBadge={showAllSubjects}
                />
              )}

              {filteredCombinedLogs.map((item, idx) => {
                const log = item.data as CareInteractionLog
                const topic = parseLogTopic(log.notes)
                const rec = parseRecipient(log.notes, 'Phụ huynh')
                const cleanNotes = cleanMessageNotes(log.notes)
                const itemKey = log?.id || `care-log-${idx}`
                const isGV =
                  log.staffName?.toLowerCase().includes('hoàng thị mai') ||
                  log.staffName?.toLowerCase().includes('gv')

                // Determine subject code for this log
                const raw = ((student?.subject || '') + ' ' + (log.notes || '') + ' ' + topic).toLowerCase()
                let itemSubject = 'TA'
                if (raw.includes('toán') || raw.includes('math') || raw.includes('[to]')) {
                  itemSubject = 'TO'
                } else if (raw.includes('tiếng anh') || raw.includes('english') || raw.includes('ielts') || raw.includes('toeic') || raw.includes('[ta]')) {
                  itemSubject = 'TA'
                } else if (raw.includes('chung') || raw.includes('dịch vụ') || raw.includes('phí') || raw.includes('xe bus')) {
                  itemSubject = 'CH'
                } else {
                  itemSubject = student?.subject === 'Toán tư duy' ? 'TO' : 'TA'
                }

                // If not showing all subjects, only show matching student's current subject or general
                const currentStudentSubjectCode = student?.subject === 'Toán tư duy' ? 'TO' : 'TA'
                if (!showAllSubjects && itemSubject !== currentStudentSubjectCode && itemSubject !== 'CH') {
                  return null
                }

                return (
                  <div key={itemKey}>
                    <HistoryLogCardItem
                      log={log}
                      topic={topic}
                      recipient={rec}
                      cleanNotes={cleanNotes}
                      staffRole={isGV ? 'GV' : 'CS'}
                      staffName={log.staffName}
                      date={log.date}
                      subject={itemSubject === 'TO' ? 'Toán tư duy' : itemSubject === 'TA' ? 'Tiếng Anh' : 'Chung'}
                      showSubjectBadge={showAllSubjects}
                    />
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="space-y-3 text-xs text-left select-none">
            <div className="space-y-2.5 relative pl-3.5 border-l border-zinc-200 dark:border-zinc-800 ml-2 py-1">
              {processedRoadmapMilestones.map((item: RoadmapMilestone, idx: number) => {
                if (staffRoleFilter === 'cskh' && item.roleOwner !== 'CS PHỤ TRÁCH') return null
                if (staffRoleFilter === 'gv' && item.roleOwner !== 'GV PHỤ TRÁCH') return null

                return (
                  <CareJourneyMilestoneCard
                    key={item.id}
                    item={item as unknown as Parameters<typeof CareJourneyMilestoneCard>[0]['item']}
                    index={idx}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
