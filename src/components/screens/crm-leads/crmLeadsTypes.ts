import { LeadStatus } from '@/mocks/crmLeads'
export type { Lead, Lead as CrmLead } from '@/mocks/crmLeads'

export interface StatusTileOption {
  id: string
  label: string
  count: number
  statusValue: string
}

export const STATUS_LABEL_MAP: Record<LeadStatus, string> = {
  // Chuẩn hóa Vòng đời Lead
  moi_tiep_nhan: 'Mới tiếp nhận',
  dang_tu_van: 'Đang tư vấn',
  hen_trai_nghiem: 'Hẹn trải nghiệm',
  cho_chot: 'Chờ chốt deal',
  chuyen_doi: 'Đã chuyển đổi',
  that_bai: 'Thất bại',
  tam_dung: 'Tạm dừng',
  // Tương thích ngược với dữ liệu cũ
  chua_tiep_can: 'Mới tiếp nhận',
  dang_cham_soc: 'Đang tư vấn',
  danh_gia_trai_nghiem: 'Hẹn trải nghiệm',
  tiem_nang: 'Chờ chốt deal',
}

export const SOURCE_LABEL_MAP: Record<string, string> = {
  facebook: 'Facebook Ads',
  hotline: 'Hotline/Tổng đài',
  event: 'Sự kiện / Workshop',
  referral: 'Giới thiệu (Referral)',
  website: 'Website / Form',
}

export const SOURCE_OPTIONS = [
  { value: 'all', label: 'Tất cả nguồn Lead' },
  { value: 'facebook', label: 'Facebook Ads' },
  { value: 'hotline', label: 'Hotline/Tổng đài' },
  { value: 'event', label: 'Sự kiện / Workshop' },
  { value: 'referral', label: 'Giới thiệu' },
  { value: 'website', label: 'Website / Form' },
]

export const ASSIGNMENT_OPTIONS = [
  { value: 'all', label: 'Tất cả trạng thái phân bổ' },
  { value: 'unassigned', label: 'Chưa phân bổ' },
  { value: 'assigned', label: 'Đã phân bổ' },
]

export const VIEW_SCOPE_OPTIONS = [
  { value: 'my', label: 'Lead của tôi' },
  { value: 'all', label: 'Tất cả Lead' },
]

export const FOLLOW_UP_OPTIONS = [
  { value: 'all', label: 'Tất cả lịch chăm sóc' },
  { value: 'today', label: '⏰ Cần gọi hôm nay' },
  { value: 'overdue', label: '⚠️ Quá hạn chăm sóc' },
]

export interface SubStatusOption {
  id: string
  label: string
}

export const SUB_STATUS_MAP: Record<string, SubStatusOption[]> = {
  all: [
    { id: 'all', label: 'Tất cả trạng thái' },
    { id: 'chua_co_sale', label: 'Mới về - Chưa phân Sale' },
    { id: 'da_phan_sale', label: 'Đã giao Sale - Chưa gọi' },
    { id: 'goi_lan_1', label: 'Đã gọi lần 1' },
    { id: 'goi_lan_2', label: 'Đã gọi lần 2' },
    { id: 'hen_goi_lai', label: 'Hẹn gọi lại sau' },
    { id: 'test_tuan_nay', label: 'Lịch test tuần này' },
    { id: 'chua_giao_gv', label: 'Chưa giao GV test' },
    { id: 'da_xac_nhan', label: 'PH đã xác nhận' },
    { id: 'dat_superkids', label: 'Đạt level SuperKids' },
    { id: 'dat_flyers', label: 'Đạt level Flyers' },
    { id: 'dat_kindy', label: 'Đạt level Kindy' },
    { id: 'giu_cho_24h', label: 'Giữ chỗ 24h' },
    { id: 'cho_chuyen_khoan', label: 'Chờ chuyển khoản' },
    { id: 'hen_nop_tien_mat', label: 'Hẹn nộp tiền mặt' },
    { id: 'da_thu_100', label: 'Đã thu 100% học phí' },
    { id: 'da_thu_coc', label: 'Đã cọc 50%' },
  ],
  unassigned: [
    { id: 'all', label: 'Tất cả chưa phân bổ' },
    { id: 'chua_co_sale', label: 'Mới về - Chưa phân Sale' },
    { id: 'chua_giao_gv', label: 'Chưa giao GV test' },
  ],
  today_tasks: [
    { id: 'all', label: 'Tất cả cần gọi hôm nay' },
    { id: 'hen_goi_lai', label: 'Hẹn gọi lại hôm nay' },
    { id: 'test_tuan_nay', label: 'Lịch hẹn hôm nay' },
  ],
  overdue: [
    { id: 'all', label: 'Tất cả quá hạn' },
    { id: 'no_show', label: 'Vắng test (No-show)' },
    { id: 'chua_co_sale', label: 'Chưa tiếp cận >24h' },
  ],
  moi_tiep_nhan: [
    { id: 'all', label: 'Tất cả mới tiếp nhận' },
    { id: 'chua_co_sale', label: 'Mới về - Chưa phân Sale' },
    { id: 'da_phan_sale', label: 'Đã giao Sale - Chưa gọi' },
  ],
  chua_tiep_can: [
    { id: 'all', label: 'Tất cả chưa tiếp cận' },
    { id: 'chua_co_sale', label: 'Mới về - Chưa phân Sale' },
    { id: 'da_phan_sale', label: 'Đã giao Sale - Chưa gọi' },
  ],
  dang_tu_van: [
    { id: 'all', label: 'Tất cả đang tư vấn' },
    { id: 'goi_lan_1', label: 'Đã gọi lần 1' },
    { id: 'goi_lan_2', label: 'Đã gọi lần 2' },
    { id: 'hen_goi_lai', label: 'Hẹn gọi lại sau' },
  ],
  dang_cham_soc: [
    { id: 'all', label: 'Tất cả đang chăm sóc' },
    { id: 'goi_lan_1', label: 'Đã gọi lần 1' },
    { id: 'goi_lan_2', label: 'Đã gọi lần 2' },
    { id: 'hen_goi_lai', label: 'Hẹn gọi lại sau' },
  ],
  hen_trai_nghiem: [
    { id: 'all', label: 'Tất cả Đánh giá & Trải nghiệm' },
    { id: 'test_tuan_nay', label: 'Lịch test tuần này' },
    { id: 'chua_giao_gv', label: 'Chưa giao GV test' },
    { id: 'da_xac_nhan', label: 'PH đã xác nhận' },
    { id: 'dat_superkids', label: 'Đạt level SuperKids' },
    { id: 'dat_flyers', label: 'Đạt level Flyers' },
    { id: 'dat_kindy', label: 'Đạt level Kindy' },
  ],
  danh_gia_trai_nghiem: [
    { id: 'all', label: 'Tất cả Đánh giá & Trải nghiệm' },
    { id: 'test_tuan_nay', label: 'Lịch test tuần này' },
    { id: 'chua_giao_gv', label: 'Chưa giao GV test' },
    { id: 'da_xac_nhan', label: 'PH đã xác nhận' },
    { id: 'dat_superkids', label: 'Đạt level SuperKids' },
    { id: 'dat_flyers', label: 'Đạt level Flyers' },
    { id: 'dat_kindy', label: 'Đạt level Kindy' },
  ],
  cho_chot: [
    { id: 'all', label: 'Tất cả chờ chốt deal' },
    { id: 'giu_cho_24h', label: 'Giữ chỗ 24h' },
    { id: 'cho_chuyen_khoan', label: 'Chờ chuyển khoản' },
    { id: 'hen_nop_tien_mat', label: 'Hẹn nộp tiền mặt' },
  ],
  tiem_nang: [
    { id: 'all', label: 'Tất cả tiềm năng' },
    { id: 'giu_cho_24h', label: 'Giữ chỗ 24h' },
    { id: 'cho_chuyen_khoan', label: 'Chờ chuyển khoản' },
    { id: 'hen_nop_tien_mat', label: 'Hẹn nộp tiền mặt' },
  ],
  chuyen_doi: [
    { id: 'all', label: 'Tất cả đã chuyển đổi' },
    { id: 'da_thu_100', label: 'Đã thu 100% học phí' },
    { id: 'da_thu_coc', label: 'Đã cọc 50%' },
  ],
  that_bai: [
    { id: 'all', label: 'Tất cả lý do thất bại' },
    { id: 'no_show', label: 'Vắng test (No-show)' },
    { id: 'khong_nghe_may', label: 'Không nghe máy' },
    { id: 'sai_so', label: 'Sai số điện thoại' },
    { id: 'nha_xa', label: 'Nhà xa cơ sở' },
    { id: 'che_phi_cao', label: 'Chê học phí cao' },
  ],
  tam_dung: [
    { id: 'all', label: 'Tất cả lý do tạm dừng' },
    { id: 've_que', label: 'Về quê / Nghỉ hè' },
    { id: 'thi_hoc_ky', label: 'Bận thi học kỳ' },
    { id: 'tai_chinh', label: 'Chờ cân đối tài chính' },
  ],
}

export type TimeRangeFilter = 'all' | 'today' | 'this_week' | 'this_month' | 'custom'

export interface TimeRangeOption {
  value: TimeRangeFilter
  label: string
}

export const TIME_RANGE_OPTIONS: TimeRangeOption[] = [
  { value: 'this_month', label: 'Tháng này (T08/2026)' },
  { value: 'this_week', label: 'Tuần này' },
  { value: 'today', label: 'Hôm nay' },
  { value: 'all', label: 'Tất cả thời gian' },
  { value: 'custom', label: 'Tùy chỉnh khoảng ngày...' },
]

export interface LeadAllMetrics {
  totalLeads: number
  assignedCount: number
  unassignedCount: number
  assignedRate: number
  experienceCount: number
  experienceTotal: number
  experienceShowUpRate: number
  convertedCount: number
  conversionRate: number
  expectedRevenue: number
  slaUnder15m: number
  sla15mTo2h: number
  slaOver2h: number
  slaRate: number
}

export interface LeadMyMetrics {
  totalLeads: number
  todayTasksCount: number
  overdueCount: number
  convertedCount: number
  conversionRate: number
  actualRevenue: number
  targetCount: number
  kpiProgressRate: number
  newCount: number
  inProgressCount: number
  experienceCount: number
  closingCount: number
}

// ========================================================
// BỘ LỌC TOÀN DIỆN: PHÂN BỔ ĐỊA BÀN & LÀM SẠCH DATA
// ========================================================

export interface AdvancedFiltersState {
  // Trụ cột 1: Phân bổ & Địa bàn
  regions: string[]
  provinces: string[]
  districts: string[]
  branches: string[]
  assignees: string[]
  teams: string[]
  // Trụ cột 2: Làm sạch Data & Chất lượng
  dataQualities: string[]
  slaStatuses: string[]
  financialSegments: string[]
  ageGroups: string[]
  customerTypes: string[]
  // Phễu, Nguồn & Chương trình
  sources: string[]
  subjects: string[]
  statuses: string[]
}

export const INITIAL_ADVANCED_FILTERS: AdvancedFiltersState = {
  regions: [],
  provinces: [],
  districts: [],
  branches: [],
  assignees: [],
  teams: [],
  dataQualities: [],
  slaStatuses: [],
  financialSegments: [],
  ageGroups: [],
  customerTypes: [],
  sources: [],
  subjects: [],
  statuses: [],
}

export const REGION_OPTIONS = [
  { value: 'mien_bac', label: 'Miền Bắc' },
  { value: 'mien_nam', label: 'Miền Nam' },
  { value: 'mien_trung', label: 'Miền Trung' },
]

export const PROVINCE_OPTIONS = [
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Khác', label: 'Tỉnh / Thành phố khác' },
]

export const DISTRICT_OPTIONS = [
  // Hà Nội
  { value: 'Hoàng Mai', label: 'Quận Hoàng Mai (HN)' },
  { value: 'Cầu Giấy', label: 'Quận Cầu Giấy (HN)' },
  { value: 'Thanh Xuân', label: 'Quận Thanh Xuân (HN)' },
  { value: 'Hà Đông', label: 'Quận Hà Đông (HN)' },
  { value: 'Nam Từ Liêm', label: 'Quận Nam Từ Liêm (HN)' },
  { value: 'Đống Đa', label: 'Quận Đống Đa (HN)' },
  { value: 'Hai Bà Trưng', label: 'Quận Hai Bà Trưng (HN)' },
  // TP.HCM
  { value: 'Quận 1', label: 'Quận 1 (TP.HCM)' },
  { value: 'Quận 3', label: 'Quận 3 (TP.HCM)' },
  { value: 'Quận 7', label: 'Quận 7 (TP.HCM)' },
  { value: 'Bình Thạnh', label: 'Quận Bình Thạnh (TP.HCM)' },
  { value: 'Thủ Đức', label: 'TP. Thủ Đức (TP.HCM)' },
]

export const DATA_QUALITY_OPTIONS = [
  { value: 'chua_goi', label: 'Chưa liên hệ (Chưa gọi)' },
  { value: 'da_ket_noi', label: 'Đã kết nối trao đổi' },
  { value: 'khong_nghe_may', label: 'Không nghe máy / Máy bận' },
  { value: 'hen_goi_lai', label: 'Có hẹn gọi lại (Callback)' },
  { value: 'so_sai_rac', label: 'Số sai / Spam / Rác (Cần dọn)' },
]

export const SLA_STATUS_OPTIONS = [
  { value: 'can_goi_hom_nay', label: '⏰ Cần gọi hôm nay' },
  { value: 'trong_han', label: '✅ Trong hạn cam kết SLA' },
  { value: 'qua_han', label: '⚠️ Quá hạn xử lý SLA' },
]

export const FINANCIAL_SEGMENT_OPTIONS = [
  { value: 'vip', label: 'VIP cao cấp (> 40tr)' },
  { value: 'kha_gia', label: 'Khá giả (3 - 5tr/tháng)' },
  { value: 'tieu_chuan', label: 'Tiêu chuẩn (1 - 3tr/tháng)' },
  { value: 'chua_xac_dinh', label: 'Chưa xác định ngân sách' },
]

export const AGE_GROUP_OPTIONS = [
  { value: 'kindy', label: 'Mầm non (Dưới 6 tuổi)' },
  { value: 'tieu_hoc', label: 'Tiểu học (6 - 10 tuổi / Lớp 1-5)' },
  { value: 'thcs', label: 'THCS (11 - 15 tuổi / Lớp 6-9)' },
  { value: 'thpt', label: 'THPT & Người lớn (16+ tuổi)' },
]

export const CUSTOMER_TYPE_OPTIONS = [
  { value: 'new', label: 'Lead mới tinh' },
  { value: 'returning', label: 'Lead quay lại (Tái tiếp cận)' },
]

export const SALES_TEAM_OPTIONS = [
  { value: 'Team Sale 01', label: 'Team Sale 01 (Cơ sở Linh Đàm)' },
  { value: 'Team Sale 02', label: 'Team Sale 02 (Cơ sở Nguyễn Tuân)' },
  { value: 'Team Sales Manager', label: 'Team Sales Manager (Điều phối chung)' },
]

