'use client'

import React from 'react'
import { Check } from 'lucide-react'
import { StudentCareWorkItem } from './careJourneyHelpers'
import { CareJourneyMilestoneCard, RoadmapMilestoneItem } from './CareJourneyMilestoneCard'

interface CareJourneyStepperProps {
  workItem: StudentCareWorkItem
  isMini?: boolean
  isVertical?: boolean
  roleFilter?: 'all' | 'csm' | 'teacher'
}

export const CareJourneyStepper: React.FC<CareJourneyStepperProps> = ({
  workItem,
  isMini = false,
  isVertical = false,
  roleFilter = 'all',
}) => {
  const roadmapMilestones: RoadmapMilestoneItem[] = [
    {
      id: 'm1',
      code: 'TH-01',
      title: 'Prestudy (Trước khai giảng)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '01/07/2026',
      subtext: 'Xác nhận thông tin & nhận lớp',
      historyLogs: [
        {
          date: '01/07/2026 09:30',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
          note: 'Xác nhận lại lịch học, quy định lớp học và gửi link lớp Zalo cho phụ huynh.',
          quote: '“Bố đã nhận được thông tin và sẽ chuẩn bị cho con tham gia buổi đầu đúng giờ.”',
        },
      ],
    },
    {
      id: 'm2',
      code: 'TH-02',
      title: 'Buổi 1-2 (Hòa nhập ban đầu)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '05/07/2026',
      subtext: 'Hỏi thăm trải nghiệm đầu tiên',
      historyLogs: [
        {
          date: '05/07/2026 15:30',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Cuộc gọi: Châu Mẹ Nguyễn Thị Mai (Mẹ)',
          note: 'Hỏi thăm tình hình học sinh 2 buổi đầu tiên. Học viên hòa nhập tốt với các bạn và tích cực phát biểu.',
          quote: '“Bé về nhà rất hào hứng khen lớp học vui và cô giáo giảng bài dễ hiểu.”',
        },
      ],
    },
    {
      id: 'm3',
      code: 'ĐX-01',
      title: 'Chăm sóc Đột xuất (Hỏi xe đưa đón & ngoại khóa)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '15/07/2026 09:30',
      subtext: 'Phát sinh ngoài mốc',
      historyLogs: [
        {
          date: '15/07/2026 09:30',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Zalo: Trần Thị Phương (Mẹ)',
          note: 'Hướng dẫn mẹ đăng ký tuyến xe đưa đón điểm trường Cơ sở 1 và các hoạt động ngoại khóa tháng 7.',
          quote: '“Cảm ơn cô, mẹ đã gửi form đăng ký xe bus cho bé rồi nhé.”',
        },
      ],
    },
    {
      id: 'm4',
      code: 'ĐK-01',
      title: 'Báo cáo Chăm sóc Tháng 7/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'overdue',
      date: '25/07/2026',
      subtext: 'Đánh giá thái độ & chuyên cần',
      historyLogs: [
        {
          date: '20/07/2026 14:00',
          staffName: 'Lê Thị Lan (CS)',
          channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
          note: 'Trao đổi về tình hình nghỉ học 2 buổi liên tiếp và điểm thi giảm sút',
          quote: '“Bố bận việc gia đình, xin bảo lưu kết quả 1 tháng để con về quê giải quyết việc”',
        },
        {
          date: '19/07/2026 17:30',
          staffName: 'Cô Hoàng Thị Mai (GV)',
          channel: 'Zalo: Trần Thị Phương (Mẹ)',
          note: 'Giáo viên chủ nhiệm trao đổi tình hình bài tập Buổi 14 & hướng dẫn con ôn tập',
          quote: '“Mẹ cảm ơn cô giáo đã nhắc nhở, sẽ cho con làm lại bài tập 14 trong tối nay”',
        },
      ],
    },
    {
      id: 'm5',
      code: 'ĐK-02',
      title: 'Báo cáo Chăm sóc Tháng 8/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '25/08/2026',
      subtext: 'Báo cáo định kỳ tháng 8',
    },
    {
      id: 'm6',
      code: 'TH-03',
      title: 'Mini Project 1 (Dự án bài học)',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '15/09/2026',
      subtext: 'Gửi video & nhận xét sản phẩm 1',
    },
    {
      id: 'm7',
      code: 'ĐK-03',
      title: 'Báo cáo Chăm sóc Tháng 9/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '25/09/2026',
      subtext: 'Đánh giá giữa chặng',
    },
    {
      id: 'm8',
      code: 'TH-04',
      title: 'Progress Test 1 (Giữa kỳ)',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '18/10/2026',
      subtext: 'Bài thi kiểm tra giữa khóa',
    },
    {
      id: 'm9',
      code: 'ĐK-04',
      title: 'Báo cáo Chăm sóc Tháng 10/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '25/10/2026',
      subtext: 'Tư vấn kết quả thi giữa kỳ',
    },
  ]

  if (isMini) {
    return (
      <div className="flex items-center gap-1 text-[10px]">
        {roadmapMilestones.map((m, idx) => {
          const isCompleted = m.status === 'completed'
          const isOverdue = m.status === 'overdue'

          return (
            <div
              key={idx}
              className={`h-2 w-2 rounded-full border transition-all ${
                isCompleted
                  ? 'bg-emerald-500 border-emerald-600'
                  : isOverdue
                  ? 'bg-rose-500 border-rose-600 animate-pulse scale-125'
                  : 'bg-muted border-border'
              }`}
              title={`${m.code}: ${m.title} (${m.date})`}
            />
          )
        })}
      </div>
    )
  }

  if (isVertical) {
    return (
      <div className="text-xs text-left select-none p-1">
        <div className="relative pl-8 space-y-3 py-1">
          {/* Vertical timeline line - aligned at left-[13.5px] */}
          <div className="absolute left-[13.5px] top-4 bottom-4 w-0.5 bg-zinc-200 dark:bg-zinc-800" />

          {roadmapMilestones.map((item, idx) => {
            if (roleFilter === 'csm' && item.roleOwner !== 'CS PHỤ TRÁCH') return null
            if (roleFilter === 'teacher' && item.roleOwner !== 'GV PHỤ TRÁCH') return null

            return <CareJourneyMilestoneCard key={item.id} item={item} index={idx} />
          })}
        </div>
      </div>
    )
  }

  // Default Horizontal Mode
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between overflow-x-auto pb-4 gap-2 border-b border-border/60">
        {roadmapMilestones.slice(0, 8).map((m, idx) => {
          const isCompleted = m.status === 'completed'
          const isOverdue = m.status === 'overdue'

          return (
            <div key={idx} className="flex-1 min-w-[110px] flex flex-col items-center text-center group relative">
              <div
                className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                  isCompleted
                    ? 'bg-emerald-500 text-white'
                    : isOverdue
                    ? 'bg-rose-500 text-white animate-pulse scale-110 shadow-xs'
                    : 'bg-muted text-muted-foreground border border-border'
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : idx + 1}
              </div>

              <span className="font-mono text-[9.5px] font-bold text-muted-foreground mt-1.5">{m.code}</span>
              <span className="text-[11px] font-normal text-foreground line-clamp-1 mt-0.5" title={m.title}>
                {m.title.split('(')[0]}
              </span>
              <span className="text-[10px] text-muted-foreground font-mono mt-0.5">{m.date}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
