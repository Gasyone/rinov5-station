import type { TutorialVideo } from '@/components/tutorial/tutorialTypes'

export const mockTutorialVideos: TutorialVideo[] = [
  // 1. Dashboard / Home
  {
    id: 'tut-dash-01',
    title: 'Tổng quan Bàn làm việc (Home) & Xử lý Cảnh báo Đầu ngày',
    description: 'Hướng dẫn sử dụng Dashboard trung tâm, nắm bắt các chỉ số điểm danh ca dạy, học viên nghỉ học bất thường và xử lý danh sách việc cần làm nhanh.',
    youtubeId: 'k3_tw44QsZQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
    views: 128500,
    viewsText: '128.5K lượt xem',
    duration: '05:40',
    screenIds: ['dashboard', 'home'],
    category: 'Tổng quan & Điều hành',
    author: 'Ban Vận Hành Station RinoEdu',
    publishedDate: '10/09/2026',
    badgeText: 'Khuyên dùng đầu ca',
    isFeatured: true,
    steps: [
      { time: '00:00', seconds: 0, title: 'Giới thiệu giao diện Home và các khối thẻ chỉ số' },
      { time: '01:15', seconds: 75, title: 'Theo dõi ca dạy trong ngày và sĩ số dự kiến' },
      { time: '02:50', seconds: 170, title: 'Xử lý cảnh báo học viên vắng học liên tiếp 2 buổi' },
      { time: '04:20', seconds: 260, title: 'Tổng kết công việc cuối ngày của cơ sở' },
    ],
  },
  {
    id: 'tut-dash-02',
    title: 'Tối ưu hóa Phím tắt và Thao tác nhanh trên Rinov5 Station',
    description: 'Các mẹo thao tác siêu tốc: tìm kiếm toàn cục (Ctrl+K), chuyển đổi chi nhánh, lọc ngày làm việc và xem thuyết minh nghiệp vụ PO.',
    youtubeId: 'M7lc1UVf-VE',
    youtubeUrl: 'https://www.youtube.com/watch?v=M7lc1UVf-VE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
    views: 74200,
    viewsText: '74.2K lượt xem',
    duration: '03:55',
    screenIds: ['dashboard', 'home', 'global'],
    category: 'Mẹo & Năng suất',
    author: 'Team Trải nghiệm Người dùng',
    publishedDate: '18/09/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Sử dụng thanh tìm kiếm thông minh' },
      { time: '01:20', seconds: 80, title: 'Bật chế độ Thuyết minh PO khi cần hiểu logic nghiệp vụ' },
      { time: '02:35', seconds: 155, title: 'Xem lịch sử phản hồi và đóng góp ý kiến' },
    ],
  },

  // 2. Học viên (Students) & Xếp lớp
  {
    id: 'tut-stu-01',
    title: 'Hồ sơ Học viên 360°: Theo dõi Học lực, Điểm danh & Lịch sử Học vụ',
    description: 'Chi tiết cách tra cứu thông tin học viên, xem biểu đồ tiến độ học tập, kiểm tra số buổi còn lại và tạo ghi chú tương tác với phụ huynh.',
    youtubeId: 'Ke90Tje7VS0',
    youtubeUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0',
    thumbnailUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
    views: 245000,
    viewsText: '245.0K lượt xem',
    duration: '07:15',
    screenIds: ['students', 'class_placement', 'student_records'],
    category: 'Học viên & Đào tạo',
    author: 'Phòng Quản lý Học vụ RinoEdu',
    publishedDate: '05/08/2026',
    badgeText: 'Nghiệp vụ cốt lõi',
    isFeatured: true,
    steps: [
      { time: '00:00', seconds: 0, title: 'Tìm kiếm học viên theo mã HV, họ tên hoặc SĐT phụ huynh' },
      { time: '01:45', seconds: 105, title: 'Đọc thông tin tổng quan, trạng thái học phí và lớp học' },
      { time: '03:30', seconds: 210, title: 'Kiểm tra tỷ lệ chuyên cần và phiếu đánh giá định kỳ' },
      { time: '05:40', seconds: 340, title: 'Thao tác cập nhật liên hệ phụ huynh và ghi chú CSKH' },
    ],
  },
  {
    id: 'tut-stu-02',
    title: 'Quy trình Xếp lớp Học viên & Xử lý Yêu cầu Bảo lưu / Chuyển lớp',
    description: 'Hướng dẫn quy trình xếp học viên vào lớp phù hợp với trình độ đầu vào, thực hiện thủ tục bảo lưu, chuyển lớp và bù buổi đúng quy chế.',
    youtubeId: 'PkZNo7MFNFg',
    youtubeUrl: 'https://www.youtube.com/watch?v=PkZNo7MFNFg',
    thumbnailUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    views: 89300,
    viewsText: '89.3K lượt xem',
    duration: '06:30',
    screenIds: ['students', 'class_placement', 'leave_reserve', 'classes'],
    category: 'Học viên & Đào tạo',
    author: 'Ban Học vụ Station',
    publishedDate: '12/08/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Nguyên tắc xếp lớp theo độ tuổi và cấp độ' },
      { time: '02:10', seconds: 130, title: 'Thao tác xếp học viên mới vào lớp có chỗ trống' },
      { time: '04:15', seconds: 255, title: 'Tạo phiếu bảo lưu khóa học và tính thời hạn hiệu lực' },
    ],
  },

  // 3. Quản lý Lớp học (Classes) & Lịch học
  {
    id: 'tut-cls-01',
    title: 'Quản trị Lớp học: Tạo Lớp Mới, Phân công Giảng dạy & Tiến độ Giáo án',
    description: 'Quy chuẩn mở lớp học mới tại cơ sở, gán giáo viên chính - trợ giảng, thiết lập khung giờ và theo dõi tiến độ buổi học qua từng tuần.',
    youtubeId: 'L_LUpnjgPso',
    youtubeUrl: 'https://www.youtube.com/watch?v=L_LUpnjgPso',
    thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    views: 198000,
    viewsText: '198.0K lượt xem',
    duration: '08:20',
    screenIds: ['classes', 'calendar_class_schedule', 'calendar_room_schedule'],
    category: 'Vận hành Lớp học',
    author: 'Trung tâm Vận hành Giảng dạy',
    publishedDate: '01/09/2026',
    badgeText: 'Hot nhất tuần',
    isFeatured: true,
    steps: [
      { time: '00:00', seconds: 0, title: 'Quy chuẩn đặt tên mã lớp và thiết lập chỉ tiêu sĩ số' },
      { time: '02:00', seconds: 120, title: 'Gán giáo viên phụ trách và kiểm tra lịch trùng' },
      { time: '04:30', seconds: 270, title: 'Thiết lập thời khóa biểu lặp định kỳ (Thứ 2-4-6 hoặc 3-5-7)' },
      { time: '06:50', seconds: 410, title: 'Kích hoạt lớp học sang trạng thái Đang hoạt động' },
    ],
  },
  {
    id: 'tut-cls-02',
    title: 'Quản lý Thời khóa biểu & Điều phối Phòng học Tránh Xung đột',
    description: 'Cách sử dụng ma trận phòng học để phát hiện trùng phòng, dời ca học nhanh và thông báo tức thời tới phụ huynh qua ứng dụng.',
    youtubeId: 'zJSY8tbf_ys',
    youtubeUrl: 'https://www.youtube.com/watch?v=zJSY8tbf_ys',
    thumbnailUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
    views: 112000,
    viewsText: '112.0K lượt xem',
    duration: '05:10',
    screenIds: ['calendar_class_schedule', 'calendar_room_schedule', 'classes'],
    category: 'Vận hành Lớp học',
    author: 'Điều phối Cơ sở Station',
    publishedDate: '22/08/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Xem lịch theo ngày, tuần và chế độ phòng học' },
      { time: '01:40', seconds: 100, title: 'Kéo thả điều chỉnh phòng học khi có sự cố kỹ thuật' },
      { time: '03:25', seconds: 205, title: 'Hủy hoặc dời buổi học và gửi thông báo bù buổi' },
    ],
  },

  // 4. Tuyển sinh, Lead & Bán hàng (CRM)
  {
    id: 'tut-crm-01',
    title: 'Quy trình Tiếp nhận Lead & Chăm sóc Phụ huynh trên Pipeline',
    description: 'Quy chuẩn phân loại nguồn khách hàng tiềm năng, gọi điện tư vấn theo kịch bản chuẩn, cập nhật trạng thái tương tác và thiết lập lịch hẹn test.',
    youtubeId: 'fJ9rUzIMcZQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop&q=80',
    views: 310000,
    viewsText: '310.0K lượt xem',
    duration: '09:05',
    screenIds: ['crm_leads', 'crm_my_leads', 'sales_pipeline'],
    category: 'Kinh doanh & Tuyển sinh',
    author: 'Học viện Đào tạo Tư vấn RinoEdu',
    publishedDate: '15/07/2026',
    badgeText: 'Tỷ lệ chốt cao',
    isFeatured: true,
    steps: [
      { time: '00:00', seconds: 0, title: 'Phân tích thông tin phụ huynh và nhu cầu của học viên' },
      { time: '02:30', seconds: 150, title: 'Thao tác gọi điện trực tiếp từ hệ thống và ghi âm cuộc gọi' },
      { time: '05:10', seconds: 310, title: 'Kéo thả cơ hội trên Kanban Pipeline sang bước Đặt lịch Test' },
      { time: '07:20', seconds: 440, title: 'Lên lịch hẹn nhắc nhở chăm sóc lại phụ huynh' },
    ],
  },
  {
    id: 'tut-crm-02',
    title: 'Tổ chức Buổi Đánh giá Năng lực (Test) & Lớp Trải nghiệm Thực tế',
    description: 'Hướng dẫn quản lý danh sách học viên đăng ký kiểm tra đầu vào, chấm điểm năng lực, trả kết quả và chuyển đổi thành đơn đăng ký học.',
    youtubeId: 'dQw4w9WgXcQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    views: 65400,
    viewsText: '65.4K lượt xem',
    duration: '06:15',
    screenIds: ['booking_test', 'trial_class', 'calendar_event_schedule'],
    category: 'Kinh doanh & Tuyển sinh',
    author: 'Phòng Đón tiếp & Tư vấn Trải nghiệm',
    publishedDate: '28/08/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Xem danh sách học viên đăng ký test theo khung giờ' },
      { time: '01:50', seconds: 110, title: 'Điểm danh học viên tới trung tâm và giao đề kiểm tra' },
      { time: '03:40', seconds: 220, title: 'Nhập điểm số và nhận xét năng lực của giáo viên' },
      { time: '05:10', seconds: 310, title: 'Tạo đơn hàng đăng ký khóa học ngay sau buổi test' },
    ],
  },

  // 5. Đơn hàng, Thu phí & Công nợ (Finance / Orders)
  {
    id: 'tut-ord-01',
    title: 'Tạo Đơn Hàng Đăng Ký Khóa Học, Áp Mã Giảm Giá & Thu Phí Nhiều Đợt',
    description: 'Chi tiết thao tác tạo đơn mới cho phụ huynh, chọn gói học phí SKU, áp dụng chiến dịch khuyến mại/voucher và lập phiếu thu học phí theo kỳ.',
    youtubeId: 'W6NZfCO5SIk',
    youtubeUrl: 'https://www.youtube.com/watch?v=W6NZfCO5SIk',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80',
    views: 184000,
    viewsText: '184.0K lượt xem',
    duration: '07:45',
    screenIds: ['orders', 'payment_receipts', 'order_fulfillment'],
    category: 'Tài chính & Thu phí',
    author: 'Phòng Kế toán & Quản lý Đơn hàng',
    publishedDate: '02/09/2026',
    badgeText: 'Quy chuẩn kế toán',
    isFeatured: true,
    steps: [
      { time: '00:00', seconds: 0, title: 'Tạo mới đơn hàng và chọn học viên thụ hưởng' },
      { time: '02:00', seconds: 120, title: 'Chọn khóa học và áp dụng mã voucher hợp lệ' },
      { time: '04:15', seconds: 255, title: 'Thiết lập kỳ hạn thanh toán (Thanh toán 1 lần hoặc trả góp đợt)' },
      { time: '06:00', seconds: 360, title: 'In phiếu thu / gửi biên nhận điện tử qua Zalo/SMS' },
    ],
  },
  {
    id: 'tut-ord-02',
    title: 'Quản lý Bàn giao Học liệu, Giáo trình & Theo dõi Đơn Vận chuyển',
    description: 'Quy trình xuất kho bàn giao sách học cho học viên tại quầy lễ tân hoặc tạo mã vận đơn gửi ship tận nhà cho phụ huynh.',
    youtubeId: 'bMknfKXIFA8',
    youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    views: 52100,
    viewsText: '52.1K lượt xem',
    duration: '04:50',
    screenIds: ['order_fulfillment', 'orders'],
    category: 'Tài chính & Thu phí',
    author: 'Bộ phận Hậu cần & Vật phẩm',
    publishedDate: '19/09/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Kiểm tra trạng thái đơn hàng đã thanh toán đủ điều kiện nhận sách' },
      { time: '01:30', seconds: 90, title: 'Bàn giao trực tiếp tại quầy và xác nhận chữ ký số' },
      { time: '03:10', seconds: 190, title: 'Tạo phiếu giao hàng chuyển phát nhanh' },
    ],
  },

  // 6. Sản phẩm, Khóa học & Khuyến mại
  {
    id: 'tut-prod-01',
    title: 'Cấu hình Danh mục Khóa học, Gói Học phí & Chương trình Ưu đãi',
    description: 'Hướng dẫn cấu hình các SKU khóa học, thiết lập đơn giá giờ học, định mức số buổi và xây dựng chính sách học bổng dành cho cơ sở.',
    youtubeId: 'M576WGiDBdQ',
    youtubeUrl: 'https://www.youtube.com/watch?v=M576WGiDBdQ',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    views: 93800,
    viewsText: '93.8K lượt xem',
    duration: '06:00',
    screenIds: ['products', 'campaigns', 'promotions'],
    category: 'Khóa học & Sản phẩm',
    author: 'Phòng Phát triển Sản phẩm Giáo dục',
    publishedDate: '10/08/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Tạo sản phẩm khóa học và định nghĩa lộ trình học' },
      { time: '02:15', seconds: 135, title: 'Cấu hình bảng giá và các gói thanh toán linh hoạt' },
      { time: '04:00', seconds: 240, title: 'Tạo mã voucher giảm giá có giới hạn số lượt' },
    ],
  },

  // 7. Nhân sự & Giảng viên
  {
    id: 'tut-hr-01',
    title: 'Quản lý Hồ sơ Giáo viên, Xếp Lịch Dạy & Đăng Ký Khung Giờ Rảnh',
    description: 'Quy trình kiểm duyệt hồ sơ bằng cấp giảng viên, phân quyền cơ sở công tác và tiếp nhận lịch đăng ký khả dụng hàng tháng.',
    youtubeId: '7CqJlxBYj-M',
    youtubeUrl: 'https://www.youtube.com/watch?v=7CqJlxBYj-M',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=80',
    views: 78500,
    viewsText: '78.5K lượt xem',
    duration: '05:30',
    screenIds: ['hr_employees', 'work_registration', 'my_schedule'],
    category: 'Nhân sự & Giảng viên',
    author: 'Phòng Quản lý Đội ngũ Giảng dạy',
    publishedDate: '14/09/2026',
    steps: [
      { time: '00:00', seconds: 0, title: 'Xem danh sách nhân sự và phân bổ theo cơ sở' },
      { time: '01:45', seconds: 105, title: 'Duyệt bảng đăng ký ca dạy rảnh của giáo viên' },
      { time: '03:30', seconds: 210, title: 'Tính toán định mức giờ dạy thực tế' },
    ],
  },
]

/**
 * Lấy danh sách video khớp với màn hình hiện tại.
 * Luôn trả về:
 * - matchedVideos: Các video được gắn đúng screenId hiện tại
 * - otherVideos: Các video phổ biến / thuộc các màn khác
 * - currentScreenName: Tên tiếng Việt thân thiện của màn hình
 */
export function getTutorialVideosForScreen(screenId?: string | null): {
  matchedVideos: TutorialVideo[]
  otherVideos: TutorialVideo[]
  allVideos: TutorialVideo[]
} {
  const allVideos = mockTutorialVideos

  if (!screenId) {
    return {
      matchedVideos: allVideos.slice(0, 4),
      otherVideos: allVideos.slice(4),
      allVideos,
    }
  }

  const cleanScreenId = screenId.split('/')[0].toLowerCase()

  const matched = allVideos.filter(
    (v) =>
      v.screenIds.includes(cleanScreenId) ||
      v.screenIds.includes('global')
  )

  const others = allVideos.filter((v) => !matched.some((m) => m.id === v.id))

  // Nếu màn hình hiện tại chưa có video khớp trực tiếp, trả về các video gợi ý phổ biến
  const finalMatched = matched.length > 0 ? matched : allVideos.slice(0, 3)
  const finalOthers = matched.length > 0 ? others : allVideos.slice(3)

  return {
    matchedVideos: finalMatched,
    otherVideos: finalOthers,
    allVideos,
  }
}
