export type CampaignStatus = 'hoat_dong' | 'ket_thuc' | 'ngung_hoat_dong'
export type CampaignApplyType = 'ma_rieng' | 'ma_chung' | 'khong_can_ma'
export type CampaignDiscountType = 'giam_truc_tiep' | 'giam_theo_phantram'
export type CampaignProductForm = 'all' | 'new_only' | 'renewal_only'

export interface CostAllocation {
  id: string
  source: string
  percentage: number
}

export interface CampaignSkuItem {
  sku: string
  name: string
}

export interface CampaignItem {
  id: string
  code: string
  name: string
  description: string
  status: CampaignStatus
  startDate: string
  endDate: string | null
  budget: number | null
  applyType: CampaignApplyType
  promoCode: string
  campaignType: CampaignDiscountType
  discountValue: number
  maxUsagePerUser: number
  autoDisplay: boolean
  limitRule: 'dong_thoi' | 'duy_nhat'
  uniqueLimitGroup?: string
  costAllocations: CostAllocation[]
  minOrderValue: number
  applyScope: 'sku' | 'category'
  productForm: CampaignProductForm
  applicableSkus: CampaignSkuItem[]
  createdBy: string
  createdAt: string
  usedCount: number
}

export const mockCampaigns: CampaignItem[] = [
  {
    id: 'camp-01',
    code: '9K1EB',
    name: 'Rino Offline_CSBH Ưu đãi con CBNV TA 1 năm',
    description: 'Chính sách bán hàng ưu đãi học phí môn Tiếng Anh 1 năm dành cho con Cán bộ nhân viên Rino',
    status: 'hoat_dong',
    startDate: '2026-08-24 00:00:00',
    endDate: null,
    budget: null,
    applyType: 'ma_rieng',
    promoCode: 'CSCBNVLINHDAMTA',
    campaignType: 'giam_truc_tiep',
    discountValue: 23900000,
    maxUsagePerUser: 2,
    autoDisplay: false,
    limitRule: 'dong_thoi',
    costAllocations: [{ id: 'cost-1', source: 'STATION', percentage: 100 }],
    minOrderValue: 1000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'SC00379',
        name: '[Station] Global Digi 96 buổi (2 Station + 2 Digi/ tuần)',
      },
    ],
    createdBy: 'Phạm Thị Lan (Admin)',
    createdAt: '2026-08-24',
    usedCount: 2,
  },
  {
    id: 'camp-02',
    code: '8T2FA',
    name: 'Rino Offline_CSBH Ưu đãi con CBNV Toán 1 năm',
    description: 'Chính sách bán hàng ưu đãi học phí môn Toán tư duy 1 năm dành cho con Cán bộ nhân viên Rino',
    status: 'hoat_dong',
    startDate: '2026-08-24 00:00:00',
    endDate: null,
    budget: null,
    applyType: 'ma_rieng',
    promoCode: 'CSCBNVLINHDAMTOAN',
    campaignType: 'giam_truc_tiep',
    discountValue: 23900000,
    maxUsagePerUser: 2,
    autoDisplay: false,
    limitRule: 'dong_thoi',
    costAllocations: [{ id: 'cost-1', source: 'STATION', percentage: 100 }],
    minOrderValue: 1000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'ST00382',
        name: '[Station] Tiếng Anh OMO_1:10_96 buổi',
      },
    ],
    createdBy: 'Phạm Thị Lan (Admin)',
    createdAt: '2026-08-24',
    usedCount: 0,
  },
  {
    id: 'camp-03',
    code: 'CBO500',
    name: 'Giảm giá combo DIGI - TUTOR 500K 12 Tháng',
    description: 'Giảm ngay 500.000đ khi đăng ký Combo DIGI - TUTOR thời hạn từ 12 tháng trở lên',
    status: 'hoat_dong',
    startDate: '2026-08-22 00:00:00',
    endDate: null,
    budget: 500000000,
    applyType: 'ma_chung',
    promoCode: 'CB0500K12TH',
    campaignType: 'giam_truc_tiep',
    discountValue: 500000,
    maxUsagePerUser: 1,
    autoDisplay: true,
    limitRule: 'dong_thoi',
    costAllocations: [
      { id: 'cost-1', source: 'STATION', percentage: 70 },
      { id: 'cost-2', source: 'MARKETING', percentage: 30 },
    ],
    minOrderValue: 10000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'CB-OMO-VIP',
        name: '[Gói Combo] Combo Tiếng Anh OMO Toàn Diện + Balo & Giáo trình',
      },
      {
        sku: 'SC00379',
        name: '[Station] Global Digi 96 buổi (2 Station + 2 Digi/ tuần)',
      },
    ],
    createdBy: 'Nguyễn Thu Hà (Marketing)',
    createdAt: '2026-08-22',
    usedCount: 142,
  },
  {
    id: 'camp-04',
    code: 'CBO200',
    name: 'Giảm giá combo DIGI - TUTOR 200K 6 Tháng',
    description: 'Giảm ngay 200.000đ khi đăng ký Combo DIGI - TUTOR thời hạn 6 tháng',
    status: 'hoat_dong',
    startDate: '2026-08-22 00:00:00',
    endDate: null,
    budget: 200000000,
    applyType: 'ma_chung',
    promoCode: 'CB0200K6TH',
    campaignType: 'giam_truc_tiep',
    discountValue: 200000,
    maxUsagePerUser: 1,
    autoDisplay: true,
    limitRule: 'dong_thoi',
    costAllocations: [
      { id: 'cost-1', source: 'STATION', percentage: 70 },
      { id: 'cost-2', source: 'MARKETING', percentage: 30 },
    ],
    minOrderValue: 6000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'CB-DUO-PLUS',
        name: '[DUO PLUS] Combo Gia hạn KHTN & Toán (6 tháng)',
      },
      {
        sku: 'ST00383',
        name: '[Station] Tiếng Anh OMO_1:10_48 buổi',
      },
    ],
    createdBy: 'Nguyễn Thu Hà (Marketing)',
    createdAt: '2026-08-22',
    usedCount: 98,
  },
  {
    id: 'camp-05',
    code: 'VCH-LD',
    name: 'RinoStation_Voucher giảm trừ HS',
    description: 'Voucher hỗ trợ giảm trừ trực tiếp cho học viên chi nhánh Linh Đàm chuyển tiếp',
    status: 'ket_thuc',
    startDate: '2026-08-21 00:00:00',
    endDate: '2026-08-22 23:59:59',
    budget: 15000000,
    applyType: 'ma_rieng',
    promoCode: 'VOUCHERGIAMTRULD',
    campaignType: 'giam_truc_tiep',
    discountValue: 1500000,
    maxUsagePerUser: 1,
    autoDisplay: false,
    limitRule: 'duy_nhat',
    uniqueLimitGroup: 'Nhóm voucher bảo trợ',
    costAllocations: [{ id: 'cost-1', source: 'STATION', percentage: 100 }],
    minOrderValue: 5000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'ST00385',
        name: '[Gia sư] Tiếng anh OMO 1:1 _ 48 buổi _ GV Phil',
      },
    ],
    createdBy: 'Lê Văn Hưng (QL Linh Đàm)',
    createdAt: '2026-08-21',
    usedCount: 1,
  },
  {
    id: 'camp-06',
    code: 'NV36T',
    name: 'Rino Station_Ngày vàng T8 36T giảm 19.5%',
    description: 'Chương trình Ngày Vàng Tháng 8 chiết khấu 19.5% cho gói đóng phí 36 tháng',
    status: 'hoat_dong',
    startDate: '2026-08-18 00:00:00',
    endDate: null,
    budget: 1000000000,
    applyType: 'ma_chung',
    promoCode: 'NGAYVANGT836THANG',
    campaignType: 'giam_truc_tiep',
    discountValue: 3000000,
    maxUsagePerUser: 1,
    autoDisplay: true,
    limitRule: 'dong_thoi',
    costAllocations: [
      { id: 'cost-1', source: 'STATION', percentage: 50 },
      { id: 'cost-2', source: 'MARKETING', percentage: 50 },
    ],
    minOrderValue: 25000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'ST00382',
        name: '[Station] Tiếng Anh OMO_1:10_96 buổi',
      },
    ],
    createdBy: 'Ban Giám Đốc RinoEdu',
    createdAt: '2026-08-18',
    usedCount: 312,
  },
  {
    id: 'camp-07',
    code: 'NV24T',
    name: 'Rino Station_Ngày vàng T8 24T giảm 14%',
    description: 'Chương trình Ngày Vàng Tháng 8 chiết khấu 14% trực tiếp theo % gói học 24 tháng',
    status: 'hoat_dong',
    startDate: '2026-08-18 00:00:00',
    endDate: null,
    budget: 800000000,
    applyType: 'ma_chung',
    promoCode: 'NGAYVANGT824THANG',
    campaignType: 'giam_theo_phantram',
    discountValue: 14,
    maxUsagePerUser: 1,
    autoDisplay: true,
    limitRule: 'dong_thoi',
    costAllocations: [
      { id: 'cost-1', source: 'STATION', percentage: 50 },
      { id: 'cost-2', source: 'MARKETING', percentage: 50 },
    ],
    minOrderValue: 18000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'ST00383',
        name: '[Station] Tiếng Anh OMO_1:10_48 buổi',
      },
    ],
    createdBy: 'Ban Giám Đốc RinoEdu',
    createdAt: '2026-08-18',
    usedCount: 186,
  },
  {
    id: 'camp-08',
    code: 'PAUSE01',
    name: 'Chiến dịch Tri ân Cơ sở Nguyễn Tuân (Tạm dừng)',
    description: 'Chiến dịch ưu đãi giảm giá đặc biệt dịp sinh nhật cơ sở Nguyễn Tuân',
    status: 'ngung_hoat_dong',
    startDate: '2026-06-01 00:00:00',
    endDate: '2026-12-31 23:59:59',
    budget: 50000000,
    applyType: 'ma_rieng',
    promoCode: 'VOUCHERCSNGUYENTUAN',
    campaignType: 'giam_truc_tiep',
    discountValue: 1000000,
    maxUsagePerUser: 1,
    autoDisplay: false,
    limitRule: 'duy_nhat',
    costAllocations: [{ id: 'cost-1', source: 'STATION', percentage: 100 }],
    minOrderValue: 6000000,
    applyScope: 'sku',
    productForm: 'all',
    applicableSkus: [
      {
        sku: 'ST00361',
        name: '[Gia sư] Tiếng anh 1:4 _ 96 buổi _ GV Native',
      },
    ],
    createdBy: 'Phạm Thanh Tùng (QL Nguyễn Tuân)',
    createdAt: '2026-06-01',
    usedCount: 12,
  },
]

export function getInitialCampaigns(): CampaignItem[] {
  return mockCampaigns
}
