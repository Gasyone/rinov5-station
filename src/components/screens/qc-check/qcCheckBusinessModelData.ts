export interface WorkflowStep {
  id: number
  key: string
  title: string
  subtitle: string
  statusKey: string
  statusLabel: string
  statusBadgeClass: string
  actor: string
  action: string
  input: string
  output: string
  slaTime: string
  uiMapping: string
  description: string
  details: string[]
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    key: 'detection',
    title: '1. Phát hiện sự cố',
    subtitle: 'Khởi tạo qua Thanh tra hoặc Hệ thống',
    statusKey: 'open',
    statusLabel: 'Mở (Open)',
    statusBadgeClass: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800',
    actor: 'Thanh tra viên (Inspector) hoặc Bot AI/IoT',
    action: 'Đi tuần thực tế hoặc Quét tự động dữ liệu (quên điểm danh, trễ giờ, cam AI)',
    input: 'Hiện trường lớp học, phòng ốc, camera giám sát hoặc log điểm danh',
    output: 'Phiếu sự cố QC mới (hỗ trợ tạo đơn lẻ hoặc tạo theo lô - Batch Create)',
    slaTime: 'Khởi tạo ngay khi phát hiện vi phạm (Tối đa 15 phút)',
    uiMapping: 'Nút "Ghi nhận sự cố" trên Toolbar ➔ Dialog Tạo theo lô (Batch Dialog)',
    description: 'Sự cố được lập biên bản với đầy đủ tiêu chí, mô tả, mức độ vi phạm và bằng chứng ban đầu (hình ảnh/link).',
    details: [
      'Gán đúng Nhóm đối tượng: Giáo viên (Teacher), Cơ sở vật chất (Facility), Vận hành (Operations).',
      'Định danh Mức độ vi phạm (Severity: Thấp, Trung bình, Cao, Khẩn cấp) để hệ thống tự động gán hạn SLA.',
      'Sự cố được gán người chịu trách nhiệm (Assignee) trực tiếp xử lý.',
    ],
  },
  {
    id: 2,
    key: 'remediation',
    title: '2. Tiếp nhận & Xử lý',
    subtitle: 'Assignee lập phương án khắc phục',
    statusKey: 'correcting',
    statusLabel: 'Đang khắc phục (Correcting)',
    statusBadgeClass: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    actor: 'Nhân sự phụ trách (Assignee / Giáo viên / Quản lý CSVC)',
    action: 'Mở màn hình "Lỗi của tôi", kiểm tra nguyên nhân gốc rễ và tiến hành xử lý hiện trường',
    input: 'Thông báo sự cố, mô tả vi phạm, hạn chót xử lý (Deadline SLA)',
    output: 'Biện pháp khắc phục (Corrective Action) & Kế hoạch phòng ngừa tái diễn (Preventive Action)',
    slaTime: 'Tùy mức độ vi phạm: 2h (Critical), 12h (High), 24h (Medium), 48h-72h (Low)',
    uiMapping: 'Bộ lọc nhanh "Lỗi của tôi" ➔ Bảng sự cố cá nhân ➔ Bấm vào dòng để mở chi tiết',
    description: 'Nhân sự chịu trách nhiệm tiếp nhận lỗi, tiến hành khắc phục thực tế tại lớp học/cơ sở.',
    details: [
      'Phải xử lý đúng hạn SLA cam kết để không bị đánh dấu cờ Quá hạn (Overdue).',
      'Được quyền gửi bình luận trao đổi với Thanh tra viên nếu cần làm rõ hoặc khiếu nại thông tin vi phạm.',
      'Nếu bị gán nhầm, quản lý có thể điều chuyển người phụ trách (Reassign) kèm lý do ghi vết.',
    ],
  },
  {
    id: 3,
    key: 'submission',
    title: '3. Nộp giải pháp & Minh chứng',
    subtitle: 'Nộp báo cáo CAPA gửi nghiệm thu',
    statusKey: 'corrected',
    statusLabel: 'Chờ duyệt (Corrected)',
    statusBadgeClass: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800',
    actor: 'Nhân sự phụ trách (Assignee)',
    action: 'Điền form giải trình, tải ảnh minh chứng thực tế, nhập hành động phòng ngừa',
    input: 'Biện pháp khắc phục đã làm, ảnh chụp/link hiện trường sau sửa chữa, kế hoạch ngừa tái phạm',
    output: 'Báo cáo giải trình hoàn tất; Trạng thái chuyển sang "Chờ duyệt" để QC phúc tra',
    slaTime: 'Bắt buộc hoàn thành trước khi hết hạn SLA của sự cố',
    uiMapping: 'Tab "Khắc phục" trong Dialog Chi tiết sự cố ➔ Nhập thông tin ➔ Bấm "Nộp phương án khắc phục"',
    description: 'Nguyên tắc Evidence-First: Không có ảnh hoặc link minh chứng sẽ không thể nộp nghiệm thu.',
    details: [
      'Mỗi lần nộp được ghi nhận thành một Vòng khắc phục độc lập (Remediation Round: Round 1, Round 2...).',
      'Bảo tồn toàn bộ lịch sử nộp cũ và nhận xét của kiểm soát viên, không ghi đè dữ liệu.',
      'Sau khi nộp, hệ thống gửi thông báo cho Thanh tra viên vào kiểm tra đánh giá.',
    ],
  },
  {
    id: 4,
    key: 'verification',
    title: '4. Nghiệm thu & Quyết định',
    subtitle: 'Thanh tra kiểm tra kết quả & chốt trạng thái',
    statusKey: 'closed_or_not_met',
    statusLabel: 'Đã đóng (Closed) / Chưa đáp ứng',
    statusBadgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    actor: 'Thanh tra viên (QC Inspector) hoặc Bot tự động (System Auto-close)',
    action: 'Đối chiếu minh chứng, kiểm tra thực tế tại cơ sở, duyệt nghiệm thu hoặc từ chối',
    input: 'Báo cáo giải trình và hình ảnh minh chứng từ Vòng khắc phục hiện tại',
    output: 'Đóng sự cố thành công (Closed) HOẶC Trả về khắc phục lại (Not met) HOẶC Hủy sự cố (Cancelled)',
    slaTime: 'Kiểm tra và phản hồi trong vòng 4h - 12h sau khi nhân sự nộp nghiệm thu',
    uiMapping: 'Khu vực "Đánh giá nghiệm thu" trong Dialog Chi tiết ➔ Bấm "Nghiệm thu đóng lỗi" hoặc "Đánh giá chưa đạt"',
    description: 'Thanh tra viên kiểm tra kỹ lưỡng hiện trường để đảm bảo chất lượng được khắc phục triệt để.',
    details: [
      '✅ Nhánh Đạt: Nghiệm thu hoàn tất ➔ Chuyển trạng thái "Đã đóng" (Closed - Global Terminal).',
      '❌ Nhánh Chưa đạt: Nhập lý do yêu cầu sửa lại ➔ Chuyển "Chưa đáp ứng" (Not met) và tự động mở Round n+1.',
      '🤖 Nhánh Tự động: Đối với lỗi hệ thống (như bổ sung điểm danh muộn), Bot tự quét lại và tự động đóng lỗi.',
    ],
  },
  {
    id: 5,
    key: 'governance',
    title: '5. Thống kê & Quản trị Tái phạm',
    subtitle: 'Phân tích nhân sự & Kiểm soát KPI',
    statusKey: 'analytics',
    statusLabel: 'Giám sát liên tục',
    statusBadgeClass: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
    actor: 'Giám đốc chi nhánh & Trưởng bộ môn chuyên môn',
    action: 'Xem bảng tổng hợp theo Nhân sự (Personnel Group), phát hiện điểm nghẽn và nguy cơ tái phạm',
    input: 'Toàn bộ dữ liệu sự cố, tỷ lệ hoàn thành đúng hạn SLA, số lần vi phạm lặp lại (Recurrence)',
    output: 'Báo cáo chất lượng cơ sở, danh sách giáo viên cần đào tạo lại (Retraining), điểm thưởng/phạt KPI',
    slaTime: 'Báo cáo định kỳ hàng tuần / hàng tháng',
    uiMapping: 'Màn hình chính theo chế độ gom nhóm Nhân sự (Personnel-centric view) ➔ Badge vi phạm & Tags',
    description: 'Dữ liệu QC là cơ sở minh bạch để nâng cao chất lượng dịch vụ giáo dục và chuẩn hóa vận hành.',
    details: [
      'Gom nhóm sự cố theo từng nhân sự để thấy bức tranh toàn cảnh về hiệu suất làm việc.',
      'Cảnh báo trực quan khi nhân sự có từ 2 lỗi trở lên hoặc có lỗi tái phạm cùng một tiêu chí.',
      'Hỗ trợ xuất báo cáo làm việc trực tiếp với giáo viên trong các kỳ họp chuyên môn.',
    ],
  },
]

export interface RaciRow {
  activity: string
  inspector: string
  assignee: string
  branchHead: string
  bot: string
}

export const RACI_ROWS: RaciRow[] = [
  {
    activity: '1. Đi tuần & Ghi nhận vi phạm',
    inspector: 'R / A',
    assignee: 'I',
    branchHead: 'I',
    bot: 'R (Auto-detect)',
  },
  {
    activity: '2. Lập phương án khắc phục & nộp minh chứng',
    inspector: 'I',
    assignee: 'R / A',
    branchHead: 'C',
    bot: '—',
  },
  {
    activity: '3. Thẩm định hiện trường & Nghiệm thu đóng lỗi',
    inspector: 'R / A',
    assignee: 'I',
    branchHead: 'C',
    bot: 'R (Auto-close)',
  },
  {
    activity: '4. Đánh giá Chưa đạt & Yêu cầu làm lại',
    inspector: 'R / A',
    assignee: 'I',
    branchHead: 'I',
    bot: '—',
  },
  {
    activity: '5. Hủy phiếu do lập nhầm hoặc giải trình hợp lệ',
    inspector: 'R',
    assignee: 'I',
    branchHead: 'A (Phê duyệt)',
    bot: '—',
  },
  {
    activity: '6. Cấu hình Tiêu chuẩn Rubric & Cam kết SLA',
    inspector: 'C',
    assignee: 'I',
    branchHead: 'R / A',
    bot: '—',
  },
]

export interface BusinessRuleItem {
  number: number
  title: string
  description: string
  badgeColorClass: string
}

export const CORE_BUSINESS_RULES: BusinessRuleItem[] = [
  {
    number: 1,
    title: 'Minh chứng là điều kiện tiên quyết (Evidence-First)',
    description:
      'Mọi báo cáo giải trình và nghiệm thu bắt buộc phải đính kèm hình ảnh hiện trường thực tế hoặc đường link kiểm tra (Google Drive/LMS). Tuyệt đối không chấp nhận giải trình bằng văn bản suông mà không có minh chứng xác thực.',
    badgeColorClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  },
  {
    number: 2,
    title: 'Kiểm soát Hai cấp Độc lập (Separation of Powers)',
    description:
      'Người chịu trách nhiệm (Assignee) chỉ có quyền nộp phương án khắc phục, chuyển trạng thái sang "Chờ duyệt" (Corrected). Chỉ có Thanh tra viên (Inspector) hoặc Quản lý chất lượng mới có thẩm quyền bấm "Nghiệm thu đóng lỗi" (Closed).',
    badgeColorClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
  },
  {
    number: 3,
    title: 'Bảo tồn Vòng khắc phục Đa cấp (CAPA Iterations)',
    description:
      'Khi kiểm tra không đạt yêu cầu, kiểm soát viên bấm "Đánh giá chưa đạt", hệ thống không tạo phiếu mới mà tự động sinh Vòng 2, Vòng 3 trên cùng một hồ sơ sự cố để bảo tồn trọn vẹn tiến trình và nguyên nhân tái phạm.',
    badgeColorClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  },
  {
    number: 4,
    title: 'Bảo vệ Dữ liệu & Che số điện thoại liên lạc',
    description:
      'Trên bảng danh sách chính, toàn bộ số điện thoại của giáo viên/nhân sự được che ẩn ở giữa dạng 091****111 nhằm chống sao chép dữ liệu hàng loạt. Chỉ hiển thị đầy đủ khi mở xem chi tiết sự cố theo thẩm quyền.',
    badgeColorClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  },
  {
    number: 5,
    title: 'Đồng bộ Thẻ đếm Trạng thái Động theo Toàn bộ Bộ lọc',
    description:
      'Số lượng đếm trên các thẻ trạng thái (Tất cả, Mở, Đang khắc phục, Chờ duyệt, Đã đóng) luôn tự động tính toán lại theo tất cả các bộ lọc đang kích hoạt (Cơ sở, Môn học, Loại lỗi, Thời hạn SLA và Nhân sự) để số liệu trên thẻ luôn khớp 100% với danh sách dòng hiển thị.',
    badgeColorClass: 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  },
]
