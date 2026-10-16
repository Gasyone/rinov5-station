import type { CareInteractionLog, StudentCareAlert } from '@/mocks/careAlerts'
import type { RoadmapMilestoneItem } from './CareJourneyMilestoneCard'

export interface HistoryLogItemData {
  log: CareInteractionLog
  topic?: string
  recipient?: string
  cleanNotes: string
  staffRole: 'CS' | 'GV'
  staffName?: string
  date?: string
  channel?: string
  subject?: string
  linkedOrder?: {
    orderCode: string
    packageName: string
    totalPaidAmount?: number
    amountText?: string
    paymentStatus?: 'paid' | 'partial' | 'unpaid' | 'pending_payment'
    paymentStatusText?: string
  }
}

export type RoadmapMilestone = RoadmapMilestoneItem & {
  historyCount?: number
}

/**
 * Mốc lộ trình Gói 1 (Chính) - Bổ sung đầy đủ dữ liệu mẫu cho Thẻ tái phí (có đơn hàng liên kết) và Nhãn thất bại
 */
export function getRoadmapMilestonesPkg1(
  isMath: boolean,
  isRenewalFailed: boolean,
  isRenewalPaid: boolean,
  student?: StudentCareAlert
): RoadmapMilestone[] {
  const staff = student?.csStaff ? `${student.csStaff} (CS)` : 'Lê Thị Lan (CS)'
  const studentOrderCode = student?.linkedOrder?.orderCode || student?.linkedOrderCode || 'OD832001'
  const studentPkgName = student?.linkedOrder?.packageName || (isMath ? '[MATH_ARCH] Toán Tư Duy Archimedes G2' : '[IE_MOVERS] Tiếng Anh SuperKids Level 4')
  const studentPaidAmt = student?.linkedOrder?.totalPaidAmount || 18500000
  const studentPaidAmtText = student?.linkedOrder?.totalPaidAmount
    ? `${student.linkedOrder.totalPaidAmount.toLocaleString('vi-VN')}đ`
    : '18.500.000đ'

  return [
    {
      id: 'm1',
      code: 'CBH',
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
      code: 'CBH',
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
      code: 'CYC',
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
      code: 'CĐK',
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
      code: 'CĐK',
      title: 'Báo cáo Chăm sóc Tháng 8/2026',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '25/08/2026',
      subtext: 'Báo cáo định kỳ tháng 8',
    },
    {
      id: 'm6',
      code: 'CBH',
      title: 'Mini Project 1 (Dự án bài học)',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '15/09/2026',
      subtext: 'Gửi video & nhận xét sản phẩm 1',
    },
    // Mốc 7: Dữ liệu mẫu mang NHÃN THẤT BẠI (CGH Tái phí đợt 1)
    {
      id: 'm7',
      code: 'CGH',
      title: 'Chăm sóc Tái phí (Đợt 1)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'failed',
      statusLabel: 'Thất bại',
      date: '20/07/2026',
      subtext: 'Tư vấn tái tục khóa học tiếp theo',
      failureReason: 'Trùng lịch học văn hóa / Không thu xếp được lịch',
      historyCount: 1,
      historyLogs: [
        {
          date: '20/07/2026 15:00',
          staffName: staff,
          channel: 'Cuộc gọi: Châu Mẹ Nguyễn Thị Mai (Mẹ)',
          note: '[Lý do: Trùng lịch học văn hóa / Không thu xếp được lịch] Liên hệ tư vấn tái tục khóa học tiếp theo trước kỳ khai giảng năm học mới. Phụ huynh trao đổi con bận lịch học thêm văn hóa ở trường và tạm thời chưa có kế hoạch học thêm ca tối. Đóng ca chăm sóc với kết quả thất bại.',
          quote: '“Mẹ cảm ơn cô giáo và trung tâm đã hỗ trợ bé suốt thời gian qua. Đợt này con bận ôn thi chuyển cấp nên gia đình xin phép tạm dừng sau khi kết thúc khóa này.”',
        },
      ],
    },
    // Mốc 8: Dữ liệu mẫu mang THẺ TÁI PHÍ (Đơn hàng liên kết tái tục thành công)
    {
      id: 'm8',
      code: 'CGH',
      title: 'Chăm sóc Tái phí (Gia hạn khóa mới)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: isRenewalFailed ? 'failed' : 'completed',
      statusLabel: isRenewalFailed ? 'Thất bại' : 'Hoàn thành',
      date: '15/08/2026',
      subtext: isRenewalFailed ? 'Ghi nhận tạm dừng học sau khi kết thúc khóa' : 'Tư vấn đổi ca cuối tuần & hoàn tất tái tục',
      failureReason: isRenewalFailed ? 'Chuyển nơi sinh sống / Đi định cư nước ngoài' : undefined,
      linkedOrder: isRenewalFailed
        ? undefined
        : {
            orderCode: studentOrderCode,
            packageName: studentPkgName,
            totalPaidAmount: studentPaidAmt,
            amountText: studentPaidAmtText,
            paymentStatus: 'paid',
            paymentStatusText: 'Đã thanh toán',
          },
      historyCount: 1,
      historyLogs: isRenewalFailed
        ? [
            {
              date: '15/08/2026 11:00',
              staffName: staff,
              channel: 'Cuộc gọi: Châu Mẹ Nguyễn Thị Mai (Mẹ)',
              note: '[Lý do: Chuyển nơi sinh sống / Đi định cư nước ngoài] Liên hệ tư vấn lộ trình tiếp theo. Phụ huynh thông báo gia đình có kế hoạch định cư nước ngoài từ tháng sau nên dừng học hoàn toàn.',
              quote: '“Gia đình chuyển sang định cư nước ngoài nên xin phép dừng học sau khi kết thúc khóa này, cảm ơn trung tâm đã hỗ trợ bé suốt thời gian qua.”',
            },
          ]
        : [
            {
              date: '15/08/2026 10:30',
              staffName: staff,
              channel: 'Cuộc gọi: Châu Mẹ Nguyễn Thị Mai (Mẹ)',
              note: 'CS liên hệ lại giới thiệu lớp học cuối tuần (T7 - CN) phù hợp hoàn toàn với lịch học văn hóa của con. Phụ huynh rất hài lòng và đã đồng ý đăng ký tiếp lộ trình mới cho con, hoàn tất thanh toán 100% học phí.',
              quote: '“Lịch học cuối tuần này tiện quá, mẹ vừa chuyển khoản học phí rồi nhé, cô xếp cho con vào lớp cô Mai dạy nhé.”',
            },
          ],
    },
  ]
}

/**
 * Mốc lộ trình Gói 2 (Nâng cao) - Bổ sung đầy đủ dữ liệu mẫu cho Thẻ tái phí và Nhãn thất bại
 */
export function getRoadmapMilestonesPkg2(
  isMath: boolean,
  isRenewalFailed: boolean,
  isRenewalPaid: boolean,
  student?: StudentCareAlert
): RoadmapMilestone[] {
  const staff = student?.csStaff ? `${student.csStaff} (CS)` : 'Thu Trang (CS)'

  return [
    {
      id: 'p2-m1',
      code: 'CBH',
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
      code: 'CBH',
      title: 'Buổi 1-4 (Bắt nhịp phương pháp mới)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '28/02/2026',
      subtext: 'Đánh giá khả năng thích nghi',
      historyCount: 1,
    },
    {
      id: 'p2-m3',
      code: 'CĐK',
      title: 'Báo cáo định kỳ Giữa kỳ gói nâng cao',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'completed',
      date: '15/05/2026',
      subtext: 'Đánh giá tư duy & năng lực bứt phá',
      historyCount: 1,
    },
    {
      id: 'p2-m4',
      code: 'CĐK',
      title: 'Báo cáo định kỳ Cuối kỳ & Đánh giá năng lực',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'in_progress',
      date: '10/08/2026',
      subtext: 'Tổng kết kết quả học phần nâng cao',
    },
    // Mốc thất bại mẫu cho Gói 2
    {
      id: 'p2-m5',
      code: 'CGH',
      title: 'Chăm sóc Tái phí (Đợt 1)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'failed',
      statusLabel: 'Thất bại',
      date: '15/06/2026',
      subtext: 'Tư vấn gia hạn khóa học',
      failureReason: 'Học sinh chuẩn bị thi chuyển cấp, tạm ngưng học hè',
      historyCount: 1,
      historyLogs: [
        {
          date: '15/06/2026 14:00',
          staffName: staff,
          channel: 'Cuộc gọi: Phụ huynh',
          note: '[Lý do: Học sinh chuẩn bị thi chuyển cấp, tạm ngưng học hè] Trao đổi về tình hình học tập và lộ trình tiếp theo. Phụ huynh chia sẻ con cần tập trung ôn thi học kỳ và các môn chính khóa nên tạm hoãn gia hạn.',
          quote: '“Đợt này cháu thi cử căng thẳng nên mẹ tạm dừng khóa học, khi nào con thi xong mẹ sẽ liên hệ lại trung tâm.”',
        },
      ],
    },
    // Mốc thẻ tái phí mẫu cho Gói 2
    {
      id: 'p2-m6',
      code: 'CGH',
      title: 'Chăm sóc Tái phí (Đợt 2 - Tái tục thành công)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: isRenewalFailed ? 'failed' : 'completed',
      statusLabel: isRenewalFailed ? 'Thất bại' : 'Hoàn thành',
      date: '10/08/2026',
      subtext: isRenewalFailed ? 'Ghi nhận tạm dừng học' : 'Gia hạn gói nâng cao Archimedes',
      failureReason: isRenewalFailed ? 'Chuyển nơi sinh sống' : undefined,
      linkedOrder: isRenewalFailed
        ? undefined
        : {
            orderCode: 'OD832008',
            packageName: isMath ? '[MATH_ARCH] Toán Tư Duy Archimedes G2_48 buổi' : '[IE_MOVERS] Tiếng Anh SuperKids Level 4_48 buổi',
            totalPaidAmount: 9800000,
            amountText: '9.800.000đ',
            paymentStatus: 'paid',
            paymentStatusText: 'Đã thanh toán',
          },
      historyCount: 1,
      historyLogs: [
        {
          date: '10/08/2026 16:30',
          staffName: staff,
          channel: 'Cuộc gọi: Phụ huynh',
          note: 'Liên hệ sau kỳ thi của con, phụ huynh đồng ý đăng ký gói 48 buổi nâng cao tiếp tục lộ trình.',
          quote: '“Con thi xong tốt rồi, mẹ đăng ký tiếp gói 48 buổi cho cháu nhé.”',
        },
      ],
    },
  ]
}

/**
 * Mốc lộ trình Gói 3 (Gói hoàn thành) - Có thẻ tái phí hoàn tất chuyển gói
 */
export function getRoadmapMilestonesPkg3(isMath: boolean): RoadmapMilestone[] {
  return [
    {
      id: 'p3-m1',
      code: 'CBH',
      title: 'Nhập học khóa Khởi động',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '15/10/2025',
      subtext: 'Bắt đầu chương trình đào tạo',
      historyCount: 1,
    },
    {
      id: 'p3-m2',
      code: 'CĐK',
      title: 'Báo cáo học tập Giữa khóa',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'completed',
      date: '30/11/2025',
      subtext: 'Kiểm tra tiến độ & kỹ năng cơ bản',
      historyCount: 1,
    },
    {
      id: 'p3-m3',
      code: 'CĐK',
      title: 'Báo cáo học tập Cuối khóa',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'completed',
      date: '15/01/2026',
      subtext: 'Đánh giá đầu ra hoàn thành khóa',
      historyCount: 1,
    },
    {
      id: 'p3-m4',
      code: 'CĐK',
      title: 'Tổng kết khóa học & Trao chứng chỉ',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      date: '18/01/2026',
      subtext: 'Hoàn tất & tốt nghiệp gói học',
      historyCount: 1,
    },
    // Thẻ tái phí chuyển tiếp gói học thành công
    {
      id: 'p3-m5',
      code: 'CGH',
      title: 'Chăm sóc Tái phí (Tái tục khóa học)',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'completed',
      statusLabel: 'Hoàn thành',
      date: '18/01/2026',
      subtext: 'Hoàn tất chuyển tiếp lên gói học mới',
      linkedOrder: {
        orderCode: 'OD790741',
        packageName: isMath ? '[MATH_ARCH] Toán Tư Duy Archimedes_48 buổi' : '[IE_MOVERS] Tiếng Anh SuperKids_48 buổi',
        totalPaidAmount: 12500000,
        amountText: '12.500.000đ',
        paymentStatus: 'paid',
        paymentStatusText: 'Đã thanh toán',
      },
      historyCount: 1,
      historyLogs: [
        {
          date: '18/01/2026 15:30',
          staffName: 'Lan Anh (CS)',
          channel: 'Cuộc gọi: Phụ huynh',
          note: 'Tư vấn chuyển tiếp khóa học mới sau lễ bế giảng. Phụ huynh hoàn tất đóng phí chuyển cấp.',
          quote: '“Mẹ đóng phí tiếp rồi, sang tuần cho bé học luôn lớp mới nhé.”',
        },
      ],
    },
  ]
}

/**
 * Mốc lộ trình Gói 4 (Tương lai)
 */
export function getRoadmapMilestonesPkg4(): RoadmapMilestone[] {
  return [
    {
      id: 'p4-m1',
      code: 'CBH',
      title: 'Xác nhận nhập học & Kiểm tra xếp lớp',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'future',
      date: '20/09/2026',
      subtext: 'Khảo sát năng lực đầu vào',
    },
    {
      id: 'p4-m2',
      code: 'CBH',
      title: 'Prestudy & Họp phụ huynh đầu khóa',
      roleOwner: 'CS PHỤ TRÁCH',
      status: 'future',
      date: '28/09/2026',
      subtext: 'Phổ biến lộ trình cam kết đầu ra',
    },
    {
      id: 'p4-m3',
      code: 'CBH',
      title: 'Khai giảng khóa học chuẩn đầu ra',
      roleOwner: 'GV PHỤ TRÁCH',
      status: 'future',
      date: '01/10/2026',
      subtext: 'Bắt đầu buổi học chính thức 01',
    },
  ]
}

/**
 * Mock interaction logs cho Gói 2
 */
export function getPkg2Logs(isMath: boolean): HistoryLogItemData[] {
  return [
    {
      log: {
        id: 'p2-cstp-reason-sample',
        date: '2026-05-18 10:15',
        staffName: 'Trần Thảo Anh 20',
        callConfirmation: 'Đã gọi',
        audioDuration: '03:15',
        notes: '[CGH] [Đối tượng: Châu Mẹ Nguyễn Thị Mai (Mẹ)] [Lý do: Trùng lịch học văn hóa / Không thu xếp được lịch] Liên hệ tư vấn gia hạn khóa học tiếp theo trước kỳ thi chuyển cấp. Phụ huynh trao đổi con bận lịch học thêm văn hóa ở trường và tạm thời chưa có kế hoạch học thêm ca tối.',
        parentOpinion: 'Mẹ cảm ơn trung tâm đã hỗ trợ và đồng hành cùng con suốt năm học qua, đợt này con bận ôn thi nên gia đình xin phép tạm dừng.',
      },
      topic: 'CGH',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Liên hệ tư vấn gia hạn khóa học tiếp theo trước kỳ thi chuyển cấp. Phụ huynh trao đổi con bận lịch học thêm văn hóa ở trường và tạm thời chưa có kế hoạch học thêm ca tối.',
      staffRole: 'CS',
      staffName: 'Trần Thảo Anh 20',
      date: '2026-05-18 10:15',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p2-cstp-log',
        date: '2026-05-10',
        staffName: 'Ngọc Mai (Sale)',
        callConfirmation: 'Đã gọi',
        audioDuration: '02:30',
        notes: '[CGH] Đã liên hệ phụ huynh trao đổi gia hạn gói học nâng cao tiếp theo. Phụ huynh xác nhận chuyển khoản hoàn tất.',
        parentOpinion: 'Phụ huynh rất an tâm về phương pháp giảng dạy và đồng ý tái phí.',
        linkedOrder: {
          orderCode: 'OD831001',
          packageName: isMath ? 'Gói Toán tư duy 1:4 (60 buổi)' : 'Gói Tiếng Anh Level 4 (60 buổi)',
          totalPaidAmount: 12500000,
          amountText: '12.500.000đ',
          paymentStatus: 'paid',
          paymentStatusText: 'Đã thanh toán',
        },
      },
      topic: 'CGH',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Đã liên hệ phụ huynh trao đổi gia hạn gói học nâng cao tiếp theo. Phụ huynh xác nhận chuyển khoản hoàn tất.',
      staffRole: 'CS',
      staffName: 'Ngọc Mai',
      date: '2026-05-10',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
      linkedOrder: {
        orderCode: 'OD831001',
        packageName: isMath ? 'Gói Toán tư duy 1:4 (60 buổi)' : 'Gói Tiếng Anh Level 4 (60 buổi)',
        totalPaidAmount: 12500000,
        amountText: '12.500.000đ',
        paymentStatus: 'paid',
        paymentStatusText: 'Đã thanh toán',
      },
    },
    {
      log: {
        id: 'p2-gv-log',
        date: '2026-04-28',
        staffName: isMath ? 'GV. Phạm Thị Toán' : 'GV. Bùi Văn Anh',
        callConfirmation: 'Đã gặp trực tiếp',
        notes: isMath
          ? '[CBH] Giáo viên chủ nhiệm trao đổi tình hình bài tập nâng cao Buổi 8 & giải đáp kiến thức hình học logic cho học viên.'
          : '[CBH] Giáo viên bộ môn nhận xét con phát âm chuẩn, phản xạ nghe nói tốt và hoàn thành xuất sắc bài thuyết trình nhỏ.',
        parentOpinion: 'Phụ huynh rất an tâm về phương pháp giảng dạy và tương tác của giáo viên trên lớp.',
      },
      topic: 'CBH',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: isMath
        ? 'Giáo viên chủ nhiệm trao đổi tình hình bài tập nâng cao Buổi 8 & giải đáp kiến thức hình học logic cho học viên.'
        : 'Giáo viên bộ môn nhận xét con phát âm chuẩn, phản xạ nghe nói tốt và hoàn thành xuất sắc bài thuyết trình nhỏ.',
      staffRole: 'GV',
      staffName: isMath ? 'Phạm Thị Toán' : 'Bùi Văn Anh',
      date: '2026-04-28',
      channel: 'Gặp trực tiếp',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p2-cs-log-1',
        date: '2026-04-20',
        staffName: isMath ? 'Thu Trang (CSM)' : 'Minh Phương (CSM)',
        callConfirmation: 'Đã gọi',
        notes: '[CĐK] CSM trao đổi tiến độ học tập gói nâng cao định kỳ tháng thứ 2, học viên tiếp thu bài nhanh và tự tin phát biểu.',
        audioDuration: '01:45',
        parentOpinion: 'Mẹ chia sẻ con rất thích học lớp này và hào hứng làm bài tập.',
      },
      topic: 'CĐK',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'CSM trao đổi tiến độ học tập gói nâng cao định kỳ tháng thứ 2, học viên tiếp thu bài nhanh và tự tin phát biểu.',
      staffRole: 'CS',
      staffName: isMath ? 'Thu Trang' : 'Minh Phương',
      date: '2026-04-20',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
    {
      log: {
        id: 'p2-cs-log-2',
        date: '2026-03-15',
        staffName: isMath ? 'Thu Trang (CSM)' : 'Minh Phương (CSM)',
        callConfirmation: 'Đã nhắn Zalo',
        notes: '[CBH] Xác nhận lịch học bù ca cuối tuần và gửi phiếu bài tập củng cố thêm cho con qua Zalo.',
      },
      topic: 'CBH',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Xác nhận lịch học bù ca cuối tuần và gửi phiếu bài tập củng cố thêm cho con qua Zalo.',
      staffRole: 'CS',
      staffName: isMath ? 'Thu Trang' : 'Minh Phương',
      date: '2026-03-15',
      channel: 'Nhắn tin Zalo',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
  ]
}

/**
 * Mock interaction logs cho Gói 3
 */
export function getPkg3Logs(isMath: boolean): HistoryLogItemData[] {
  return [
    {
      log: {
        id: 'p3-gv-log-1',
        date: '2026-01-18',
        staffName: isMath ? 'GV. Minh Huệ' : 'GV. Nguyễn Huy Hoàng',
        callConfirmation: 'Đã gặp trực tiếp',
        notes: '[CBH] Đã trực tiếp trao đổi và động viên học viên trong buổi tổng kết khóa học. Con hoàn thành xuất sắc các nội dung và đạt chứng chỉ khen thưởng.',
        parentOpinion: 'Gia đình rất vui và cảm ơn thầy cô đã nhiệt tình kèm cặp con trong suốt khóa học vừa qua.',
      },
      topic: 'CBH',
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
        notes: '[CGH] Đã tương tác trao đổi thông tin chăm sóc học viên gói trước đó và tư vấn lộ trình học lên cấp độ tiếp theo.',
        audioDuration: '02:20',
        parentOpinion: 'Phụ huynh đồng ý đăng ký gói tiếp theo cho con.',
        linkedOrder: {
          orderCode: 'OD790741',
          packageName: isMath ? 'Gói Toán Archimedes 12T' : 'Gói Tiếng Anh Level 5 12T',
          totalPaidAmount: 18000000,
          amountText: '18.000.000đ',
          paymentStatus: 'paid',
          paymentStatusText: 'Đã thanh toán',
        },
      },
      topic: 'CGH',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Đã tương tác trao đổi thông tin chăm sóc học viên gói trước đó và tư vấn lộ trình học lên cấp độ tiếp theo.',
      staffRole: 'CS',
      staffName: 'Ngọc Mai',
      date: '2026-01-12',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
      linkedOrder: {
        orderCode: 'OD790741',
        packageName: isMath ? 'Gói Toán Archimedes 12T' : 'Gói Tiếng Anh Level 5 12T',
        totalPaidAmount: 18000000,
        amountText: '18.000.000đ',
        paymentStatus: 'paid',
        paymentStatusText: 'Đã thanh toán',
      },
    },
    {
      log: {
        id: 'p3-cs-log-2',
        date: '2025-12-20',
        staffName: 'Lan Anh (CSM)',
        callConfirmation: 'Đã nhắn Zalo',
        notes: '[CĐK] Gửi thông tin các gói học mới kèm ưu đãi đăng ký lên cấp độ tiếp theo qua Zalo.',
      },
      topic: 'CĐK',
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
        notes: '[CBH] Đã kèm cặp học viên 15 phút đầu giờ để hướng dẫn phương pháp tự học và rèn luyện kỹ năng thực hành tại lớp.',
      },
      topic: 'CBH',
      recipient: 'Châu Nguyễn Gia Bảo (Học viên)',
      cleanNotes: 'Đã kèm cặp học viên 15 phút đầu giờ để hướng dẫn phương pháp tự học và rèn luyện kỹ năng thực hành tại lớp.',
      staffRole: 'GV',
      staffName: isMath ? 'Minh Huệ' : 'Nguyễn Huy Hoàng',
      date: '2025-11-10',
      channel: 'Gặp trực tiếp',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
    },
  ]
}

/**
 * Mock interaction logs cho Gói 4
 */
export function getPkg4Logs(isMath: boolean): HistoryLogItemData[] {
  return [
    {
      log: {
        id: 'p4-cs-log-1',
        date: '2026-08-20',
        staffName: 'Linh Đan (CSM)',
        callConfirmation: 'Đã nhắn Zalo',
        notes: '[CBH] Gửi lịch khai giảng dự kiến ngày 01/10/2026 và danh mục tài liệu, giáo trình cần chuẩn bị qua Zalo cho phụ huynh.',
      },
      topic: 'CBH',
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
        notes: '[CGH] Đã tư vấn chi tiết lộ trình học tập tái phí cam kết chuẩn đầu ra. Phụ huynh đã hoàn tất đăng ký giữ chỗ và nộp phí.',
        audioDuration: '03:10',
        parentOpinion: 'Mẹ rất kỳ vọng vào khóa học mới này để con bứt phá điểm số.',
        linkedOrder: {
          orderCode: 'OD831003',
          packageName: isMath ? 'Gói Toán tư duy 1:6 (48 buổi)' : 'Gói Tiếng Anh Kindy 0 (48 buổi)',
          totalPaidAmount: 14500000,
          amountText: '14.500.000đ',
          paymentStatus: 'paid',
          paymentStatusText: 'Đã thanh toán',
        },
      },
      topic: 'CGH',
      recipient: 'Châu Mẹ Nguyễn Thị Mai (Mẹ)',
      cleanNotes: 'Đã tư vấn chi tiết lộ trình học tập cam kết chuẩn đầu ra. Phụ huynh đã hoàn tất đăng ký giữ chỗ và nộp phí.',
      staffRole: 'CS',
      staffName: 'Ngọc Mai',
      date: '2026-08-15',
      channel: 'Cuộc gọi',
      subject: isMath ? 'Toán tư duy' : 'Tiếng Anh',
      linkedOrder: {
        orderCode: 'OD831003',
        packageName: isMath ? 'Gói Toán tư duy 1:6 (48 buổi)' : 'Gói Tiếng Anh Kindy 0 (48 buổi)',
        totalPaidAmount: 14500000,
        amountText: '14.500.000đ',
        paymentStatus: 'paid',
        paymentStatusText: 'Đã thanh toán',
      },
    },
  ]
}
