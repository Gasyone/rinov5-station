'use client'

import React, { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  parseRecipient,
  parseLogTopic,
  cleanMessageNotes,
  type MergedTimelineItem,
} from './studentCareDetailHelpers'
import { type CareInteractionLog, type StudentCareAlert } from '@/mocks/careAlerts'
import { isCared } from './operationsAlertHelpers'
import { HistoryLogCardItem } from './HistoryLogCardItem'
import { CareJourneyMilestoneCard } from './CareJourneyMilestoneCard'
import type { SimulatedPackage } from './studentCareDetailTypes'

interface HistoryLogItemData {
  log: CareInteractionLog
  topic?: string
  recipient?: string
  cleanNotes: string
  staffRole: 'CS' | 'GV'
  staffName?: string
  date?: string
  channel?: string
  subject?: string
}

interface StudentCareTimelineProps {
  student?: StudentCareAlert
  filteredCombinedLogs: MergedTimelineItem[]
  stickyTopOffset?: number
  selectedPackageId?: string
  selectedPackage?: SimulatedPackage | null
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
  selectedPackageId = 'pkg-1',
  selectedPackage,
}: StudentCareTimelineProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'roadmap'>('history')
  const [staffRoleFilter, setStaffRoleFilter] = useState<string>('all')

  const isMath = useMemo(() => {
    if (selectedPackage?.packageName) {
      return selectedPackage.packageName.toLowerCase().includes('toán')
    }
    return student?.subject === 'Toán tư duy'
  }, [selectedPackage, student])

  const subjectName = isMath ? 'Toán tư duy' : 'Tiếng Anh'

  // 1. Nhật ký chăm sóc theo từng Gói học (Package-specific interaction logs)
  const pkg1Logs: HistoryLogItemData[] = useMemo(() => {
    const list: HistoryLogItemData[] = [
      {
        log: {
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
        },
        topic: 'HT-01',
        recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
        cleanNotes: 'Giáo viên chủ nhiệm trao đổi tình hình bài tập Buổi 14 & hướng dẫn con ôn tập',
        staffRole: 'GV',
        staffName: 'Hoàng Thị Mai',
        date: '2026-07-05',
        channel: 'Đã gọi',
        subject: student?.subject || subjectName,
      },
    ]

    filteredCombinedLogs.forEach((item) => {
      const log = item.data as CareInteractionLog
      const topic = parseLogTopic(log.notes)
      const rec = parseRecipient(log.notes, 'Phụ huynh')
      const cleanNotes = cleanMessageNotes(log.notes)
      const isGV =
        log.staffName?.toLowerCase().includes('hoàng thị mai') ||
        log.staffName?.toLowerCase().includes('gv')

      list.push({
        log,
        topic,
        recipient: rec,
        cleanNotes,
        staffRole: isGV ? 'GV' : 'CS',
        staffName: log.staffName,
        date: log.date,
        channel: log.callConfirmation,
        subject: student?.subject || subjectName,
      })
    })

    return list
  }, [filteredCombinedLogs, student, subjectName])

  const pkg2Logs: HistoryLogItemData[] = useMemo(() => [
    {
      log: {
        id: 'p2-gv-log',
        date: '2026-06-28',
        staffName: isMath ? 'GV. Phạm Thị Toán' : 'GV. Bùi Văn Anh',
        callConfirmation: 'Đã gặp trực tiếp',
        notes: isMath
          ? '[HT-02] Giáo viên chủ nhiệm trao đổi tình hình bài tập nâng cao Buổi 8 & giải đáp kiến thức hình học logic cho học viên.'
          : '[HT-02] Giáo viên bộ môn nhận xét con phát âm chuẩn, phản xạ nghe nói tốt và hoàn thành xuất sắc bài thuyết trình nhỏ.',
        parentOpinion: 'Phụ huynh rất an tâm về phương pháp giảng dạy và tương tác của giáo viên trên lớp.',
      },
      topic: 'HT-02',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: isMath
        ? 'Giáo viên chủ nhiệm trao đổi tình hình bài tập nâng cao Buổi 8 & giải đáp kiến thức hình học logic cho học viên.'
        : 'Giáo viên bộ môn nhận xét con phát âm chuẩn, phản xạ nghe nói tốt và hoàn thành xuất sắc bài thuyết trình nhỏ.',
      staffRole: 'GV',
      staffName: isMath ? 'Phạm Thị Toán' : 'Bùi Văn Anh',
      date: '2026-06-28',
      channel: 'Gặp trực tiếp',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p2-cs-log-1',
        date: '2026-06-20',
        staffName: isMath ? 'Thu Trang (CSM)' : 'Minh Phương (CSM)',
        callConfirmation: 'Đã gọi',
        notes: '[ĐK1] CSM trao đổi tiến độ học tập gói nâng cao định kỳ tháng thứ 2, học viên tiếp thu bài nhanh và tự tin phát biểu.',
        audioDuration: '01:45',
        parentOpinion: 'Mẹ chia sẻ con rất thích học lớp này và hào hứng làm bài tập.',
      },
      topic: 'ĐK1',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'CSM trao đổi tiến độ học tập gói nâng cao định kỳ tháng thứ 2, học viên tiếp thu bài nhanh và tự tin phát biểu.',
      staffRole: 'CS',
      staffName: isMath ? 'Thu Trang' : 'Minh Phương',
      date: '2026-06-20',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p2-cs-log-2',
        date: '2026-05-15',
        staffName: isMath ? 'Thu Trang (CSM)' : 'Minh Phương (CSM)',
        callConfirmation: 'Đã nhắn Zalo',
        notes: '[TB1] Xác nhận lịch học bù ca cuối tuần và gửi phiếu bài tập củng cố thêm cho con qua Zalo.',
      },
      topic: 'TB1',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Xác nhận lịch học bù ca cuối tuần và gửi phiếu bài tập củng cố thêm cho con qua Zalo.',
      staffRole: 'CS',
      staffName: isMath ? 'Thu Trang' : 'Minh Phương',
      date: '2026-05-15',
      channel: 'Nhắn tin Zalo',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
  ], [isMath])

  const pkg3Logs: HistoryLogItemData[] = useMemo(() => [
    {
      log: {
        id: 'p3-gv-log-1',
        date: '2026-01-18',
        staffName: isMath ? 'GV. Minh Huệ' : 'GV. Nguyễn Huy Hoàng',
        callConfirmation: 'Đã gặp trực tiếp',
        notes: '[TK-01] Đã trực tiếp trao đổi và động viên học viên trong buổi tổng kết khóa học. Con hoàn thành xuất sắc các nội dung và đạt chứng chỉ khen thưởng.',
        parentOpinion: 'Gia đình rất vui và cảm ơn thầy cô đã nhiệt tình kèm cặp con trong suốt khóa học vừa qua.',
      },
      topic: 'TK-01',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Đã trực tiếp trao đổi và động viên học viên trong buổi tổng kết khóa học. Con hoàn thành xuất sắc các nội dung và đạt chứng chỉ khen thưởng.',
      staffRole: 'GV',
      staffName: isMath ? 'Minh Huệ' : 'Nguyễn Huy Hoàng',
      date: '2026-01-18',
      channel: 'Gặp trực tiếp',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p3-cs-log-1',
        date: '2026-01-12',
        staffName: 'Ngọc Mai (Sale)',
        callConfirmation: 'Đã gọi',
        notes: '[CSTP] Đã tương tác trao đổi thông tin chăm sóc học viên gói trước đó và tư vấn lộ trình học lên cấp độ tiếp theo.',
        audioDuration: '02:20',
        parentOpinion: 'Phụ huynh đồng ý đăng ký gói tiếp theo cho con.',
      },
      topic: 'CSTP',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Đã tương tác trao đổi thông tin chăm sóc học viên gói trước đó và tư vấn lộ trình học lên cấp độ tiếp theo.',
      staffRole: 'CS',
      staffName: 'Ngọc Mai',
      date: '2026-01-12',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p3-cs-log-2',
        date: '2025-12-20',
        staffName: 'Lan Anh (CSM)',
        callConfirmation: 'Đã nhắn Zalo',
        notes: '[ĐK1] Gửi thông tin các gói học mới kèm ưu đãi đăng ký lên cấp độ tiếp theo qua Zalo.',
      },
      topic: 'ĐK1',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Gửi thông tin các gói học mới kèm ưu đãi đăng ký lên cấp độ tiếp theo qua Zalo.',
      staffRole: 'CS',
      staffName: 'Lan Anh',
      date: '2025-12-20',
      channel: 'Nhắn tin Zalo',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p3-gv-log-2',
        date: '2025-11-10',
        staffName: isMath ? 'GV. Minh Huệ' : 'GV. Nguyễn Huy Hoàng',
        callConfirmation: 'Đã gặp trực tiếp',
        notes: '[HT-01] Đã kèm cặp học viên 15 phút đầu giờ để hướng dẫn phương pháp tự học và rèn luyện kỹ năng thực hành tại lớp.',
      },
      topic: 'HT-01',
      recipient: 'Châu Nguyễn Gia Bảo (Học viên)',
      cleanNotes: 'Đã kèm cặp học viên 15 phút đầu giờ để hướng dẫn phương pháp tự học và rèn luyện kỹ năng thực hành tại lớp.',
      staffRole: 'GV',
      staffName: isMath ? 'Minh Huệ' : 'Nguyễn Huy Hoàng',
      date: '2025-11-10',
      channel: 'Gặp trực tiếp',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
  ], [isMath])

  const pkg4Logs: HistoryLogItemData[] = useMemo(() => [
    {
      log: {
        id: 'p4-cs-log-1',
        date: '2026-08-20',
        staffName: 'Linh Đan (CSM)',
        callConfirmation: 'Đã nhắn Zalo',
        notes: '[XN-01] Gửi lịch khai giảng dự kiến ngày 01/10/2026 và danh mục tài liệu, giáo trình cần chuẩn bị qua Zalo cho phụ huynh.',
      },
      topic: 'XN-01',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Gửi lịch khai giảng dự kiến ngày 01/10/2026 và danh mục tài liệu, giáo trình cần chuẩn bị qua Zalo cho phụ huynh.',
      staffRole: 'CS',
      staffName: 'Linh Đan',
      date: '2026-08-20',
      channel: 'Nhắn tin Zalo',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p4-sale-log-1',
        date: '2026-08-15',
        staffName: 'Ngọc Mai (Sale)',
        callConfirmation: 'Đã gọi',
        notes: '[TV-01] Đã tư vấn chi tiết lộ trình học tập cam kết chuẩn đầu ra. Phụ huynh đã hoàn tất đăng ký giữ chỗ và nộp phí.',
        audioDuration: '03:10',
        parentOpinion: 'Mẹ rất kỳ vọng vào khóa học mới này để con bứt phá điểm số.',
      },
      topic: 'TV-01',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Đã tư vấn chi tiết lộ trình học tập cam kết chuẩn đầu ra. Phụ huynh đã hoàn tất đăng ký giữ chỗ và nộp phí.',
      staffRole: 'CS',
      staffName: 'Ngọc Mai',
      date: '2026-08-15',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
  ], [isMath])

  // Filtered logs for current selected package
  const currentPackageLogs = useMemo(() => {
    let rawLogs: HistoryLogItemData[] = []
    if (selectedPackageId === 'pkg-2') {
      rawLogs = pkg2Logs
    } else if (selectedPackageId === 'pkg-3') {
      rawLogs = pkg3Logs
    } else if (selectedPackageId === 'pkg-4') {
      rawLogs = pkg4Logs
    } else {
      rawLogs = pkg1Logs
    }

    return rawLogs.filter((item) => {
      if (staffRoleFilter === 'cskh' && item.staffRole !== 'CS') return false
      if (staffRoleFilter === 'gv' && item.staffRole !== 'GV') return false
      return true
    })
  }, [selectedPackageId, pkg1Logs, pkg2Logs, pkg3Logs, pkg4Logs, staffRoleFilter])

  // 2. Mốc lộ trình theo từng Gói học (Package-specific roadmap milestones)
  const roadmapMilestonesPkg1: RoadmapMilestone[] = useMemo(() => [
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
      historyCount: 1,
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
      historyCount: 1,
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
      historyCount: 2,
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
          staffName: 'Hoàng Thị Mai (GV)',
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
  ], [])

  const roadmapMilestonesPkg2: RoadmapMilestone[] = useMemo(() => [
    {
      id: 'p2-m1',
      code: 'TH-01',
      title: 'Kiểm tra đầu vào & Phân lớp nâng cao',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '10/02/2026',
      subtext: 'Xếp lớp & phân bổ giảng viên chính',
      historyCount: 1,
      historyLogs: [
        {
          date: '10/02/2026 10:00',
          staffName: 'Thu Trang (CS)',
          channel: 'Cuộc gọi: Nguyễn Văn Hùng (Bố)',
          note: 'Thông báo kết quả xếp lớp nâng cao và gửi lịch học định kỳ.',
        },
      ],
    },
    {
      id: 'p2-m2',
      code: 'TH-02',
      title: 'Buổi 1-4 (Bắt nhịp phương pháp mới)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '28/02/2026',
      subtext: 'Đánh giá khả năng thích nghi',
      historyCount: 1,
    },
    {
      id: 'p2-m3',
      code: 'ĐK-01',
      title: 'Báo cáo định kỳ Giữa kỳ gói nâng cao',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'completed',
      date: '15/05/2026',
      subtext: 'Đánh giá tư duy & năng lực bứt phá',
      historyCount: 1,
    },
    {
      id: 'p2-m4',
      code: 'ĐK-02',
      title: 'Báo cáo định kỳ Cuối kỳ & Đánh giá năng lực',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'in_progress',
      date: '10/08/2026',
      subtext: 'Tổng kết kết quả học phần nâng cao',
    },
  ], [])

  const roadmapMilestonesPkg3: RoadmapMilestone[] = useMemo(() => [
    {
      id: 'p3-m1',
      code: 'TH-01',
      title: 'Nhập học khóa Khởi động',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '15/10/2025',
      subtext: 'Bắt đầu chương trình đào tạo',
      historyCount: 1,
    },
    {
      id: 'p3-m2',
      code: 'ĐK-01',
      title: 'Báo cáo học tập Giữa khóa',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'completed',
      date: '30/11/2025',
      subtext: 'Kiểm tra tiến độ & kỹ năng cơ bản',
      historyCount: 1,
    },
    {
      id: 'p3-m3',
      code: 'ĐK-02',
      title: 'Báo cáo học tập Cuối khóa',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'completed',
      date: '15/01/2026',
      subtext: 'Đánh giá đầu ra hoàn thành khóa',
      historyCount: 1,
    },
    {
      id: 'p3-m4',
      code: 'TK-01',
      title: 'Tổng kết khóa học & Trao chứng chỉ',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '18/01/2026',
      subtext: 'Hoàn tất & tốt nghiệp gói học',
      historyCount: 1,
    },
  ], [])

  const roadmapMilestonesPkg4: RoadmapMilestone[] = useMemo(() => [
    {
      id: 'p4-m1',
      code: 'TH-01',
      title: 'Xác nhận nhập học & Kiểm tra xếp lớp',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'future',
      date: '20/09/2026',
      subtext: 'Khảo sát năng lực đầu vào',
    },
    {
      id: 'p4-m2',
      code: 'TH-02',
      title: 'Prestudy & Họp phụ huynh đầu khóa',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'future',
      date: '28/09/2026',
      subtext: 'Phổ biến lộ trình cam kết đầu ra',
    },
    {
      id: 'p4-m3',
      code: 'TH-03',
      title: 'Khai giảng khóa học chuẩn đầu ra',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '01/10/2026',
      subtext: 'Bắt đầu buổi học chính thức 01',
    },
  ], [])

  const isCaredStatus = student ? isCared(student) : false

  const processedRoadmapMilestones = useMemo(() => {
    let milestones: RoadmapMilestone[] = []
    if (selectedPackageId === 'pkg-2') {
      milestones = roadmapMilestonesPkg2
    } else if (selectedPackageId === 'pkg-3') {
      milestones = roadmapMilestonesPkg3
    } else if (selectedPackageId === 'pkg-4') {
      milestones = roadmapMilestonesPkg4
    } else {
      milestones = roadmapMilestonesPkg1
    }

    return milestones.map((item) => {
      if (isCaredStatus && item.status === 'overdue') {
        return {
          ...item,
          status: 'completed' as const,
        }
      }
      return item
    })
  }, [
    selectedPackageId,
    roadmapMilestonesPkg1,
    roadmapMilestonesPkg2,
    roadmapMilestonesPkg3,
    roadmapMilestonesPkg4,
    isCaredStatus,
  ])

  const totalHistoryCount = currentPackageLogs.length

  return (
    <div className="flex flex-col bg-white dark:bg-zinc-950 rounded-2xl border border-border/60 p-3.5 shadow-2xs text-left">
      {/* Header bar: Lọc Vai trò + Tab buttons (Đã bỏ checkbox Tất cả chương trình) */}
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
              className="h-6 text-xs bg-white dark:bg-zinc-900 border border-border/80 rounded-md px-1.5 focus:outline-none focus:ring-1 focus:ring-primary font-medium text-foreground cursor-pointer shadow-3xs"
            >
              <option value="all">Tất cả</option>
              <option value="cskh">CS</option>
              <option value="gv">GV</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={() => setActiveTab('history')}
            className={cn(
              'h-6 text-xs font-semibold px-2.5 rounded-md cursor-pointer transition-colors shadow-3xs',
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
              'h-6 text-xs font-semibold px-2.5 rounded-md cursor-pointer transition-colors shadow-3xs',
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
          <div className="space-y-3 pt-0.5">
            {currentPackageLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-muted-foreground italic">
                Chưa có nhật ký chăm sóc cho gói học này
              </div>
            ) : (
              currentPackageLogs.map((item, idx) => (
                <HistoryLogCardItem
                  key={item.log.id || `pkg-log-${idx}`}
                  log={item.log}
                  topic={item.topic}
                  recipient={item.recipient}
                  cleanNotes={item.cleanNotes}
                  staffRole={item.staffRole}
                  staffName={item.staffName}
                  date={item.date}
                  channel={item.channel}
                  subject={item.subject}
                />
              ))
            )}
          </div>
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

