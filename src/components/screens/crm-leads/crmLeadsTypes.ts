import { LeadStatus } from '@/mocks/crmLeads'

export interface StatusTileOption {
  id: string
  label: string
  count: number
  statusValue: string
}

export const STATUS_LABEL_MAP: Record<LeadStatus, string> = {
  chua_tiep_can: 'Chưa tiếp cận',
  dang_cham_soc: 'Đang chăm sóc',
  danh_gia_trai_nghiem: 'Đánh giá & Trải nghiệm',
  tiem_nang: 'Tiềm năng',
  chuyen_doi: 'Đã chuyển đổi',
  that_bai: 'Thất bại',
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
    { id: 'no_show', label: 'Vắng test (No-show)' },
    { id: 'khong_nghe_may', label: 'Không nghe máy' },
    { id: 'sai_so', label: 'Sai số điện thoại' },
    { id: 'nha_xa', label: 'Nhà xa cơ sở' },
    { id: 'che_phi_cao', label: 'Chê học phí cao' },
  ],
  chua_tiep_can: [
    { id: 'all', label: 'Tất cả chưa tiếp cận' },
    { id: 'chua_co_sale', label: 'Mới về - Chưa phân Sale' },
    { id: 'da_phan_sale', label: 'Đã giao Sale - Chưa gọi' },
  ],
  dang_cham_soc: [
    { id: 'all', label: 'Tất cả đang chăm sóc' },
    { id: 'goi_lan_1', label: 'Đã gọi lần 1' },
    { id: 'goi_lan_2', label: 'Đã gọi lần 2' },
    { id: 'hen_goi_lai', label: 'Hẹn gọi lại sau' },
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
}
