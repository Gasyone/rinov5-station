import { TriggerSource, TriggerOperator } from './careConditionsTypes'

// 9 chuẩn Nguồn chỉ số hệ thống
export const METRIC_SOURCES: { id: TriggerSource; label: string }[] = [
  { id: 'curriculum_path', label: 'Lộ trình - Khung chương trình' },
  { id: 'class_db', label: 'CSDL Lớp học' },
  { id: 'attendance_session', label: 'CSDL Buổi học' },
  { id: 'exam_grade', label: 'CSDL Điểm Kiểm tra' },
  { id: 'homework_db', label: 'CSDL BTVN' },
  { id: 'attitude_rating', label: 'CSDL Thái độ (Rating sao)' },
  { id: 'subscription_package', label: 'Gói đăng ký' },
  { id: 'periodic_time', label: 'Định kỳ - Theo thời gian' },
  { id: 'student_account', label: 'Học viên & Tài khoản' },
]

export interface MetricDefinition {
  id: string
  source: TriggerSource
  label: string
  unit: string
  isEventMilestone?: boolean
  operators: { value: TriggerOperator; label: string }[]
  windowOptions: { value: string; label: string }[]
  scopeOptions: { value: string; label: string }[]
  defaultOperator: TriggerOperator
  defaultThreshold: number
}

// Danh mục Tiêu chí & Quy tắc động theo từng Nguồn chỉ số (cho 8 nguồn ngoài Lộ trình)
export const METRIC_CATALOG: Record<string, MetricDefinition[]> = {
  class_db: [
    {
      id: 'class_doi_giao_vien',
      source: 'class_db',
      label: 'Phát sinh Đổi / Thế ca Giáo viên phụ trách',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tức thời khi có quyết định / lịch đổi GV' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời khi ghi nhận thay đổi (Real-time)' },
        { value: 'truoc_buoi_24h', label: 'Trước buổi học bị đổi GV 24 giờ' },
        { value: 'truoc_buoi_12h', label: 'Trước buổi học bị đổi GV 12 giờ' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'theo_mon_hoc', label: 'Theo môn học' },
        { value: 'toan_trung_tam', label: 'Toàn cơ sở / trung tâm' },
      ],
    },
    {
      id: 'class_doi_tro_giang',
      source: 'class_db',
      label: 'Phát sinh Đổi / Thay Trợ giảng (TA)',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tức thời khi có lịch thay trợ giảng' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời khi ghi nhận thay đổi (Real-time)' },
        { value: 'truoc_buoi_12h', label: 'Trước buổi học 12 giờ' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'theo_mon_hoc', label: 'Theo môn học' },
      ],
    },
    {
      id: 'class_doi_phong_hoc',
      source: 'class_db',
      label: 'Phát sinh Đổi phòng học / Địa điểm học',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tức thời khi đổi phòng học' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời khi cập nhật phòng (Real-time)' },
        { value: 'truoc_buoi_12h', label: 'Trước buổi học 12 giờ' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'toan_trung_tam', label: 'Toàn cơ sở / trung tâm' },
      ],
    },
    {
      id: 'class_doi_lich_buoi_hoc',
      source: 'class_db',
      label: 'Phát sinh Đổi giờ / Đổi lịch buổi học',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tức thời khi có lịch điều chỉnh' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời khi ghi nhận thay đổi (Real-time)' },
        { value: 'truoc_buoi_24h', label: 'Trước giờ học mới 24 giờ' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'theo_mon_hoc', label: 'Theo môn học' },
      ],
    },
    {
      id: 'class_huy_hoan_buoi_hoc',
      source: 'class_db',
      label: 'Phát sinh Hủy / Hoãn buổi học đột xuất',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tức thời khi báo hoãn / hủy buổi' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời khi thông báo hoãn/hủy (Real-time)' },
        { value: 'truoc_buoi_24h', label: 'Trước giờ học dự kiến 24 giờ' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'toan_trung_tam', label: 'Toàn cơ sở / trung tâm' },
      ],
    },
    {
      id: 'class_sap_khai_giang',
      source: 'class_db',
      label: 'Cảnh báo Lớp sắp khai giảng / Bắt đầu khóa mới',
      unit: 'ngày',
      defaultOperator: 'lte',
      defaultThreshold: 3,
      operators: [
        { value: 'lte', label: '≤ (Còn lại số ngày)' },
        { value: 'eq', label: '= (Đúng ngày khai giảng)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_ngay', label: 'Rà soát định kỳ hàng ngày (08:00)' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'theo_mon_hoc', label: 'Theo môn học' },
      ],
    },
    {
      id: 'class_sap_be_giang',
      source: 'class_db',
      label: 'Cảnh báo Lớp sắp bế giảng / Kết thúc khóa học',
      unit: 'buổi',
      defaultOperator: 'lte',
      defaultThreshold: 2,
      operators: [
        { value: 'lte', label: '≤ (Còn lại số buổi cuối)' },
        { value: 'eq', label: '= (Buổi bế giảng)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Rà soát định kỳ hàng tuần' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'theo_mon_hoc', label: 'Theo môn học' },
      ],
    },
    {
      id: 'class_tach_gop_chuyen_lop',
      source: 'class_db',
      label: 'Học viên phát sinh Chuyển lớp / Tách gộp lớp',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Kích hoạt khi hoàn tất thủ tục chuyển lớp' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời khi duyệt chuyển lớp (Real-time)' },
      ],
      scopeOptions: [
        { value: 'theo_tung_lop', label: 'Tính riêng theo từng Lớp học' },
        { value: 'toan_trung_tam', label: 'Toàn cơ sở / trung tâm' },
      ],
    },
  ],

  attendance_session: [
    {
      id: 'att_nghi_khong_phep',
      source: 'attendance_session',
      label: 'Số buổi nghỉ không phép',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 2,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
        { value: '30_ngay', label: 'Trong 30 ngày gần nhất' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Gộp toàn trung tâm' },
      ],
    },
    {
      id: 'att_den_muon',
      source: 'attendance_session',
      label: 'Số buổi đến muộn (đi trễ)',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 3,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Gộp toàn trung tâm' },
      ],
    },
    {
      id: 'att_nghi_co_phep',
      source: 'attendance_session',
      label: 'Số buổi nghỉ có phép',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 3,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Gộp toàn trung tâm' },
      ],
    },
    {
      id: 'att_tong_vang',
      source: 'attendance_session',
      label: 'Tổng số buổi vắng mặt (có phép + không phép)',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 4,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Gộp toàn trung tâm' },
      ],
    },
    {
      id: 'att_lien_tiep_vang',
      source: 'attendance_session',
      label: 'Số buổi nghỉ liên tiếp',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 2,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Gộp toàn trung tâm' },
      ],
    },
  ],

  exam_grade: [
    {
      id: 'exam_any_score',
      source: 'exam_grade',
      label: 'Điểm bài kiểm tra bất kỳ',
      unit: 'điểm',
      defaultOperator: 'lte',
      defaultThreshold: 7.0,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'bai_test_gan_nhat', label: 'Ngay sau bài test gần nhất' },
        { value: 'toan_khoa', label: 'Bài kiểm tra bất kỳ trong khóa' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'theo_ky_thi', label: 'Theo kỳ thi toàn trung tâm' },
      ],
    },
    {
      id: 'exam_dinh_ky',
      source: 'exam_grade',
      label: 'Điểm bài kiểm tra định kỳ (Quasitest)',
      unit: 'điểm',
      defaultOperator: 'lte',
      defaultThreshold: 6.5,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'bai_test_gan_nhat', label: 'Ngay sau bài test gần nhất' },
        { value: '2_bai_test_gan_nhat', label: 'Trung bình 2 bài test gần nhất' },
        { value: 'toan_khoa', label: 'Trung bình toàn khóa' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'theo_ky_thi', label: 'Theo kỳ thi toàn trung tâm' },
      ],
    },
    {
      id: 'exam_midterm',
      source: 'exam_grade',
      label: 'Điểm thi Mid-term (Giữa kỳ)',
      unit: 'điểm',
      defaultOperator: 'lte',
      defaultThreshold: 7.0,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'bai_test_gan_nhat', label: 'Ngay sau bài test Giữa kỳ' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'theo_ky_thi', label: 'Theo kỳ thi toàn trung tâm' },
      ],
    },
    {
      id: 'exam_final',
      source: 'exam_grade',
      label: 'Điểm thi Final Test (Cuối kỳ)',
      unit: 'điểm',
      defaultOperator: 'lte',
      defaultThreshold: 7.0,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'bai_test_gan_nhat', label: 'Ngay sau bài test Cuối kỳ' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'theo_ky_thi', label: 'Theo kỳ thi toàn trung tâm' },
      ],
    },
    {
      id: 'exam_score_drop',
      source: 'exam_grade',
      label: 'Mức giảm điểm so với bài test liền trước',
      unit: 'điểm',
      defaultOperator: 'gte',
      defaultThreshold: 2.0,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: '2_bai_test_gan_nhat', label: 'So sánh 2 bài test gần nhất' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
      ],
    },
  ],

  homework_db: [
    {
      id: 'hw_thieu_btvn',
      source: 'homework_db',
      label: 'Số buổi thiếu / chưa nộp BTVN',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 3,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
    {
      id: 'hw_nop_muon',
      source: 'homework_db',
      label: 'Số buổi nộp BTVN muộn',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 3,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
    {
      id: 'hw_chua_dat',
      source: 'homework_db',
      label: 'Số buổi BTVN đánh giá Chưa đạt (< 5 điểm)',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 2,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
    {
      id: 'hw_ty_le_hoan_thanh',
      source: 'homework_db',
      label: 'Tỷ lệ hoàn thành BTVN (%)',
      unit: '%',
      defaultOperator: 'lte',
      defaultThreshold: 70,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
        { value: 'trong_thang', label: 'Trong tháng hiện tại' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn / lớp' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
  ],

  attitude_rating: [
    {
      id: 'att_rating_trung_binh',
      source: 'attitude_rating',
      label: 'Điểm đánh giá thái độ trung bình (1-5 sao)',
      unit: 'sao',
      defaultOperator: 'lte',
      defaultThreshold: 3,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: '30_ngay', label: 'Trong 30 ngày gần nhất' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
    {
      id: 'att_rating_1_2_sao',
      source: 'attitude_rating',
      label: 'Số buổi bị đánh giá 1-2 sao (Cần lưu ý)',
      unit: 'buổi',
      defaultOperator: 'gte',
      defaultThreshold: 2,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: '30_ngay', label: 'Trong 30 ngày gần nhất' },
        { value: 'toan_khoa', label: 'Trong toàn khóa học' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
    {
      id: 'att_nhan_xet_tieu_cuc',
      source: 'attitude_rating',
      label: 'Cảnh báo nhận xét thái độ cần can thiệp từ Giáo viên',
      unit: 'lần',
      defaultOperator: 'gte',
      defaultThreshold: 1,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'milestone', label: 'Kích hoạt ngay' },
      ],
      windowOptions: [
        { value: 'custom_sessions', label: 'Số buổi cuộn gần nhất (Nhập N)' },
        { value: '30_ngay', label: 'Trong 30 ngày gần nhất' },
      ],
      scopeOptions: [
        { value: 'theo_tung_mon', label: 'Tính riêng theo môn' },
        { value: 'toan_trung_tam', label: 'Toàn trung tâm' },
      ],
    },
  ],

  subscription_package: [
    {
      id: 'sub_package_activated',
      source: 'subscription_package',
      label: 'Mốc Kích hoạt gói học mới',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Kích hoạt khi mốc sự kiện xảy ra' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Định kỳ rà soát hằng tuần (Thứ 2)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_package_expired',
      source: 'subscription_package',
      label: 'Mốc Gói học hết hạn',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Kích hoạt khi mốc sự kiện xảy ra' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Định kỳ rà soát hằng tuần (Thứ 2)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_package_reserved',
      source: 'subscription_package',
      label: 'Mốc Học viên phát sinh Đơn Bảo lưu / Tạm dừng gói',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Kích hoạt khi mốc sự kiện xảy ra' }],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_so_buoi_con_lai',
      source: 'subscription_package',
      label: 'Số buổi học còn lại trong gói',
      unit: 'buổi',
      defaultOperator: 'lte',
      defaultThreshold: 5,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Định kỳ rà soát hằng tuần (Thứ 2)' },
        { value: 'dinh_ky_hang_thang', label: 'Định kỳ rà soát hằng tháng (Ngày 1)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_so_ngay_con_lai',
      source: 'subscription_package',
      label: 'Số ngày còn hạn của hợp đồng / gói học',
      unit: 'ngày',
      defaultOperator: 'lte',
      defaultThreshold: 15,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Định kỳ rà soát hằng tuần (Thứ 2)' },
        { value: 'dinh_ky_hang_thang', label: 'Định kỳ rà soát hằng tháng (Ngày 1)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_ty_le_tieu_dung',
      source: 'subscription_package',
      label: 'Tỷ lệ tiêu dùng số buổi (%)',
      unit: '%',
      defaultOperator: 'gte',
      defaultThreshold: 90,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_thang', label: 'Định kỳ rà soát hằng tháng (Ngày 1)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_so_tien_con_no',
      source: 'subscription_package',
      label: 'Số tiền / Học phí chưa thanh toán',
      unit: 'VNĐ',
      defaultOperator: 'gte',
      defaultThreshold: 1000000,
      operators: [
        { value: 'gte', label: '≥ (Lớn hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Định kỳ rà soát hằng tuần (Thứ 2)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
    {
      id: 'sub_sap_het_han',
      source: 'subscription_package',
      label: 'Cảnh báo gói sắp hết hạn',
      unit: 'ngày',
      defaultOperator: 'lte',
      defaultThreshold: 7,
      operators: [
        { value: 'lte', label: '≤ (Nhỏ hơn hoặc bằng)' },
        { value: 'eq', label: '= (Bằng chính xác)' },
      ],
      windowOptions: [
        { value: 'realtime', label: 'Tức thời theo thời gian thực (Real-time)' },
        { value: 'dinh_ky_hang_tuan', label: 'Định kỳ rà soát hằng tuần (Thứ 2)' },
      ],
      scopeOptions: [
        { value: 'theo_goi_hoc', label: 'Tính riêng theo từng Gói đăng ký' },
        { value: 'toan_bo_goi_hoc_vien', label: 'Tổng hợp toàn bộ các Gói học của Học viên' },
      ],
    },
  ],

  periodic_time: [
    {
      id: 'periodic_by_date_of_month',
      source: 'periodic_time',
      label: 'Theo mốc Ngày trong tháng',
      unit: 'ngày',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Định kỳ theo mốc lịch' }],
      windowOptions: [
        { value: 'ngay_25', label: 'Ngày 25 hằng tháng' },
        { value: 'ngay_1', label: 'Ngày 1 hằng tháng' },
        { value: 'ngay_15', label: 'Ngày 15 hằng tháng' },
        { value: 'ngay_cuoi_thang', label: 'Ngày cuối cùng của tháng' },
        { value: 'custom_dates_month', label: 'Tự nhập danh sách ngày (VD: 1; 15; 25)' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
    {
      id: 'periodic_by_week_and_day',
      source: 'periodic_time',
      label: 'Theo mốc Tuần & Thứ trong tháng',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Định kỳ theo mốc lịch' }],
      windowOptions: [
        { value: 'custom_week_day', label: 'Tùy chọn thiết lập Tuần & Thứ' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
    {
      id: 'periodic_by_annual_date',
      source: 'periodic_time',
      label: 'Theo Ngày cụ thể trong năm (Ngày lễ / Mốc sự kiện)',
      unit: 'ngày',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Định kỳ theo mốc lịch' }],
      windowOptions: [
        { value: 'le_01_06', label: 'Quốc tế Thiếu nhi (01/06)' },
        { value: 'le_20_11', label: 'Ngày Nhà giáo Việt Nam (20/11)' },
        { value: 'le_noel', label: 'Giáng sinh (25/12)' },
        { value: 'custom_holiday_date', label: 'Chọn / Nhập mốc ngày lễ tùy chọn' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
  ],

  student_account: [
    {
      id: 'student_birthday',
      source: 'student_account',
      label: 'Sinh nhật Học viên',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tự động theo mốc sinh nhật' }],
      windowOptions: [
        { value: 'ngay_sinh_nhat', label: 'Đúng ngày sinh nhật' },
        { value: 'truoc_1_ngay', label: 'Trước sinh nhật 1 ngày' },
        { value: 'truoc_3_ngay', label: 'Trước sinh nhật 3 ngày (Khuyên dùng)' },
        { value: 'truoc_7_ngay', label: 'Trước sinh nhật 7 ngày' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
    {
      id: 'student_anniversary',
      source: 'student_account',
      label: 'Kỷ niệm N năm đồng hành / Nhập học (Loyalty Milestone)',
      unit: 'năm',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Tự động theo mốc ngày nhập học' }],
      windowOptions: [
        { value: 'tron_1_nam', label: 'Tròn 1 năm đồng hành' },
        { value: 'tron_2_nam', label: 'Tròn 2 năm đồng hành' },
        { value: 'tron_3_nam', label: 'Tròn 3 năm đồng hành' },
        { value: 'tron_5_nam', label: 'Tròn 5 năm đồng hành (Học viên VIP)' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
    {
      id: 'student_age_transition',
      source: 'student_account',
      label: 'Chuyển chặng Độ tuổi / Cấp học',
      unit: 'tuổi',
      isEventMilestone: true,
      defaultOperator: 'milestone',
      defaultThreshold: 1,
      operators: [{ value: 'milestone', label: 'Kích hoạt khi học viên đủ độ tuổi' }],
      windowOptions: [
        { value: 'tuoi_6', label: 'Bước sang 6 tuổi (Vào Lớp 1 - Cấp 1)' },
        { value: 'tuoi_11', label: 'Bước sang 11 tuổi (Vào Lớp 6 - Cấp 2)' },
        { value: 'tuoi_15', label: 'Bước sang 15 tuổi (Vào Lớp 10 - Cấp 3)' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
    {
      id: 'student_account_status',
      source: 'student_account',
      label: 'Thay đổi Trạng thái Hồ sơ / Tài khoản Học viên',
      unit: 'mốc',
      isEventMilestone: true,
      defaultOperator: 'status_change',
      defaultThreshold: 1,
      operators: [{ value: 'status_change', label: 'Kích hoạt khi hồ sơ thay đổi trạng thái' }],
      windowOptions: [
        { value: 'status_bao_luu', label: 'Tài khoản chuyển sang trạng thái Bảo lưu' },
        { value: 'status_tot_nghiep', label: 'Tài khoản chuyển sang trạng thái Hoàn thành / Tốt nghiệp' },
        { value: 'status_chuyen_co_so', label: 'Tài khoản chuyển sang trạng thái Chuyển cơ sở' },
      ],
      scopeOptions: [
        { value: 'toan_trung_tam', label: 'Toàn trung tâm / Toàn hệ thống' },
        { value: 'theo_chi_nhanh', label: 'Theo từng chi nhánh / cơ sở' },
      ],
    },
  ],
}
