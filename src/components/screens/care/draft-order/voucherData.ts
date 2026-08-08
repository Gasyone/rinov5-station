export interface VoucherItem {
  id: string
  code: string
  title: string
  description: string
  discountType: 'direct' | 'percentage' | 'buy_x_get_y'
  discountValue: number // e.g. 500000 or 3 (%) or 0 for gift
  minOrderValue: number
  expiryText: string
  applicableTargetText?: string
  campaignType: string
  applicableProducts: string[]
  applicableCategoryText: string
  appliedDateText: string
  giftText?: string
}

export const MOCK_VOUCHERS: VoucherItem[] = [
  // ── 1. GIẢM GIÁ TRỰC TIẾP ──
  {
    id: 'v-1',
    code: 'PHREFER300',
    title: '[TUTOR/IELTS] Giảm 300k cho phụ huynh giới thiệu',
    description: 'Chỉ áp dụng cho PH giới thiệu và khi PH được giới thiệu lên đơn thành công',
    discountType: 'direct',
    discountValue: 300000,
    minOrderValue: 0,
    expiryText: 'Không giới hạn',
    applicableTargetText: 'Áp dụng cho một số danh mục cụ thể',
    campaignType: 'GIẢM GIÁ TRỰC TIẾP',
    applicableCategoryText: 'Theo danh mục',
    appliedDateText: 'Từ ngày 28/11/2024',
    applicableProducts: [
      '• IELTS',
      '• IELTS > IELTS X',
      '• IELTS > GIA SƯ',
      '• TUTOR',
      '• TUTOR > TIỂU HỌC',
    ],
  },
  {
    id: 'v-2',
    code: 'TATTD500K',
    title: 'Combo Tiếng anh + Toán tư duy : Giảm 500.000đ',
    description: 'Giảm 500.000đ combo Tiếng anh + Toán tư duy',
    discountType: 'direct',
    discountValue: 500000,
    minOrderValue: 0,
    expiryText: 'Không giới hạn',
    applicableTargetText: 'Áp dụng cho một số sản phẩm cụ thể',
    campaignType: 'GIẢM GIÁ TRỰC TIẾP',
    applicableCategoryText: 'Theo sản phẩm (SKU)',
    appliedDateText: 'Từ ngày 20/05/2025',
    applicableProducts: [
      '• Combo Tiếng anh kindie 1:4 + Toán tư duy CO...',
      '• Combo Tiếng anh CAM 1:4 + Toán tư duy AR...',
      '• COMBO TIẾNG ANH CAM + TOÁN TƯ DUY EI...',
    ],
  },
  {
    id: 'v-3',
    code: 'GIOITHIEUGIAM1TR',
    title: '[GIA SƯ] Tri ân khách hàng - Giảm 1.000.000đ',
    description: 'Ưu đãi dành cho phụ huynh thân thiết giới thiệu học viên mới',
    discountType: 'direct',
    discountValue: 1000000,
    minOrderValue: 1000000,
    expiryText: 'Không giới hạn',
    applicableTargetText: 'Áp dụng cho một số danh mục cụ thể',
    campaignType: 'GIẢM GIÁ TRỰC TIẾP',
    applicableCategoryText: 'Theo danh mục',
    appliedDateText: 'Từ ngày 01/06/2025',
    applicableProducts: [
      '• Tất cả khóa học Gia sư 1:1',
      '• Tất cả gói combo Gia sư + Khóa học',
    ],
  },

  // ── 2. MUA X TẶNG Y ──
  {
    id: 'v-4',
    code: 'AEHB1000K',
    title: '[Station] Anh Em Tặng 1 tháng Học bổng',
    description: 'Ưu đãi Anh Em học cùng nhau - Tặng 1 tháng học bổng trải nghiệm',
    discountType: 'buy_x_get_y',
    discountValue: 0,
    minOrderValue: 1000000,
    expiryText: 'Không giới hạn',
    campaignType: 'MUA X TẶNG Y',
    applicableCategoryText: 'Theo sản phẩm (SKU)',
    appliedDateText: 'Từ ngày 15/07/2026',
    giftText: 'Tặng 1 tháng học bổng trải nghiệm Station',
    applicableProducts: [
      '• [Station] Tiếng Anh 1:4 (24 buổi)',
      '• [Station] Toán tư duy 1:6 (24 buổi)',
      '• Tất cả các gói combo Station',
    ],
  },
  {
    id: 'v-5',
    code: 'STATIONHTTDHB',
    title: '[Station] Học tập toàn diện - tặng học bổng',
    description: 'Chương trình học tập toàn diện - Tặng suất học bổng tài năng',
    discountType: 'buy_x_get_y',
    discountValue: 0,
    minOrderValue: 1000000,
    expiryText: 'Không giới hạn',
    campaignType: 'MUA X TẶNG Y',
    applicableCategoryText: 'Theo sản phẩm (SKU)',
    appliedDateText: 'Từ ngày 01/08/2026',
    giftText: 'Tặng học bổng toàn phần 1 kỳ học',
    applicableProducts: [
      '• [Station] Global Digi 96 buổi (2 Station + 2 Digi/tuần)',
      '• [Station] Global Digi 192 buổi (2 Station + 2 Digi/tuần)',
      '• [Station] Global Digi 288 buổi (2 Station + 2 Digi/tuần)',
    ],
  },

  // ── 3. GIẢM GIÁ THEO % ──
  {
    id: 'v-6',
    code: 'CSBHTGGIAM3',
    title: 'Rino Offline_CSBH Trả góp giảm 3%',
    description: 'CSBH Trả góp giảm 3%',
    discountType: 'percentage',
    discountValue: 3,
    minOrderValue: 1000000,
    expiryText: 'Không giới hạn',
    applicableTargetText: 'Áp dụng cho một số sản phẩm cụ thể',
    campaignType: 'GIẢM GIÁ THEO %',
    applicableCategoryText: 'Theo sản phẩm (SKU)',
    appliedDateText: 'Từ ngày 31/07/2026',
    applicableProducts: [
      '• [Station] Toán tư duy 1:10 _48 buổi',
      '• [Station] Toán tư duy 1:10 _96 buổi',
      '• [Station] Toán tư duy 1:10 _144 buổi',
      '• [Station] Global Digi 96 buổi (2 Station + 2 Digi/tuần)',
      '• [Station] Global Digi 144 buổi (2 Station + 2 Digi/tuần)',
      '• [Station] Global Digi 192 buổi (2 station + 2 Digi/tuần)',
      '• [Station] Global Digi 288 buổi (2 station + 2 Digi/tuần)',
    ],
  },
  {
    id: 'v-7',
    code: 'CSBHTH8G11',
    title: 'Station_CSBH Tháng 8 giảm 11% trả góp 18T',
    description: 'Chương trình CSBH Tháng 8 giảm 11% áp dụng gói trả góp 18 tháng',
    discountType: 'percentage',
    discountValue: 11,
    minOrderValue: 1000000,
    expiryText: 'Không giới hạn',
    applicableTargetText: 'Áp dụng cho một số sản phẩm cụ thể',
    campaignType: 'GIẢM GIÁ THEO %',
    applicableCategoryText: 'Theo sản phẩm (SKU)',
    appliedDateText: 'Từ ngày 01/08/2026',
    applicableProducts: [
      '• [Station] Global Digi 192 buổi',
      '• [Station] Global Digi 288 buổi',
    ],
  },
  {
    id: 'v-8',
    code: '2024CBNV10',
    title: '[VuiHoc] Giảm 10% cho CBNV Vuihọc (chính thức)',
    description: 'Ưu đãi dành riêng cho CBNV Vuihoc có xác nhận nhân sự',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 0,
    expiryText: 'Không giới hạn',
    applicableTargetText: 'Áp dụng cho một số danh mục cụ thể',
    campaignType: 'GIẢM GIÁ THEO %',
    applicableCategoryText: 'Theo sản phẩm (SKU)',
    appliedDateText: 'Từ ngày 01/01/2024',
    applicableProducts: [
      '• Tất cả khóa học và gia sư',
      '• Không áp dụng đồng thời chương trình thanh lý',
    ],
  },
]
