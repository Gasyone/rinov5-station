export interface DraftOrderItem {
  id: string
  category: 'gia_su' | 'khoa_hoc' | 'combo'
  categoryName: string
  isNew: boolean
  isRenewal: boolean
  program: string
  teacher: string
  packageType: string
  center?: string
  productCode: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  childAccount: string
  activationMethod?: string
  activationDate?: string
  isCustomPrice?: boolean
  priceRangePlaceholder?: string
  renewalPackageId?: string
}

export interface ExistingPackageOption {
  id: string
  childAccount: string
  packageName: string
  program: string
  teacher: string
  packageType: string
  center?: string
  productCode: string
  unitPrice: number
  expiryDate: string
  remainingText: string
}

export const MOCK_CHILD_PACKAGES: Record<string, ExistingPackageOption[]> = {
  'con-1': [
    {
      id: 'PKG-101',
      childAccount: 'con-1',
      packageName: '[Station] Cambridge Standard_1:10_48 buổi (Hạn 30/08/2026 - Còn 4 buổi)',
      program: 'Chương trình Station',
      teacher: 'Việt Nam',
      packageType: '1:10 - 48 buổi',
      center: 'Rino Linh Đàm',
      productCode: '[Station] Cambridge Standard_1:10_48 buổi',
      unitPrice: 14500000,
      expiryDate: '30/08/2026',
      remainingText: 'Còn 4 buổi',
    },
    {
      id: 'PKG-102',
      childAccount: 'con-1',
      packageName: '[DUO] Tiếng anh ( 50 tháng ) (Hạn 15/12/2026 - Còn 8 tháng)',
      program: '[TIỂU HỌC] Tiếng Anh',
      teacher: 'GV Khóa học',
      packageType: '50 tháng',
      productCode: '[DUO] Tiếng anh ( 50 tháng )',
      unitPrice: 15000000,
      expiryDate: '15/12/2026',
      remainingText: 'Còn 8 tháng',
    },
  ],
  'con-2': [
    {
      id: 'PKG-201',
      childAccount: 'con-2',
      packageName: '[Station] Tiếng Anh OMO_1:10_48 buổi (Hạn 15/07/2026 - Đã hết hạn)',
      program: 'Chương trình Station',
      teacher: 'Việt Nam',
      packageType: '1:10 - 48 buổi',
      center: 'Rino An Khánh',
      productCode: '[Station] Tiếng Anh OMO_1:10_48 buổi',
      unitPrice: 12000000,
      expiryDate: '15/07/2026',
      remainingText: 'Hết hạn',
    },
    {
      id: 'PKG-202',
      childAccount: 'con-2',
      packageName: '[DUO] Gia hạn Toán 2 ( 1 năm ) (Hạn 20/10/2026 - Còn 3 tháng)',
      program: '[THCS] Toán học',
      teacher: 'GV Khóa học',
      packageType: '1 năm',
      productCode: '[DUO] Gia hạn Toán 2 ( 1 năm )',
      unitPrice: 750000,
      expiryDate: '20/10/2026',
      remainingText: 'Còn 3 tháng',
    },
  ],
  'con-3': [
    {
      id: 'PKG-301',
      childAccount: 'con-3',
      packageName: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_48 buổi (Hạn 05/09/2026 - Còn 6 buổi)',
      program: '[THCS] Tiếng Anh IELTS',
      teacher: '1:1 - Phil',
      packageType: '48 buổi',
      productCode: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_48 buổi',
      unitPrice: 15400000,
      expiryDate: '05/09/2026',
      remainingText: 'Còn 6 buổi',
    },
  ],
  'con-4': [
    {
      id: 'PKG-401',
      childAccount: 'con-4',
      packageName: '[Station] Tiếng anh tiểu học_1:10_48 buổi (Hạn 20/05/2026 - Đã hết hạn)',
      program: 'Chương trình Station',
      teacher: 'Việt Nam',
      packageType: '1:10 - 48 buổi',
      center: 'Rino Linh Đàm',
      productCode: '[Station] Tiếng anh tiểu học_1:10_48 buổi',
      unitPrice: 6500000,
      expiryDate: '20/05/2026',
      remainingText: 'Hết hạn',
    },
  ],
}

export interface ChildGroup {
  id: string
  childAccount: string
  childName: string
  items: DraftOrderItem[]
}

export interface ComboSubItem {
  productName: string
  type: string
  duration: string
  quantity: number
  discountPolicy: string
}

export interface CatalogProduct {
  code: string
  name: string
  subtext: string
  price: number
  category: 'gia_su' | 'khoa_hoc' | 'combo'
  program: string
  teacher: string
  packageType: string
  center?: string
  isCustomPrice?: boolean
  priceRangePlaceholder?: string
  comboDetails?: string
  subItems?: ComboSubItem[]
}

export const PRODUCT_CATALOG: CatalogProduct[] = [
  // ── SẢN PHẨM GIA SƯ / STATION (Matches Screenshot 3 & 4) ──
  {
    code: '[Station] Tiếng anh tiểu học_1:10_48 buổi',
    name: '[Station] Tiếng anh tiểu học_1:10_48 buổi',
    subtext: 'Chương trình Station - 1:10 - Việt Nam - 48 buổi',
    price: 0,
    category: 'gia_su',
    program: 'Chương trình Station',
    teacher: 'Việt Nam',
    packageType: '1:10 - 48 buổi',
    center: 'Rino Linh Đàm',
    isCustomPrice: true,
    priceRangePlaceholder: '6.500.000 (đ) - 14.500.000 (đ)',
  },
  {
    code: '[Station] Cambridge Standard_1:10_48 buổi',
    name: '[Station] Cambridge Standard_1:10_48 buổi',
    subtext: 'Chương trình Station - 1:10 - Việt Nam - 48 buổi',
    price: 14500000,
    category: 'gia_su',
    program: 'Chương trình Station',
    teacher: 'Việt Nam',
    packageType: '1:10 - 48 buổi',
    center: 'Rino Linh Đàm',
  },
  {
    code: '[Station] Tiếng Anh OMO_1:10_48 buổi',
    name: '[Station] Tiếng Anh OMO_1:10_48 buổi',
    subtext: 'Chương trình Station - 1:10 - Việt Nam - 48 buổi',
    price: 12000000,
    category: 'gia_su',
    program: 'Chương trình Station',
    teacher: 'Việt Nam',
    packageType: '1:10 - 48 buổi',
    center: 'Rino An Khánh',
  },
  {
    code: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_72 buổi',
    name: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_72 buổi',
    subtext: 'Tiếng Anh IELTS - 1:1 - Phil - 72 buổi',
    price: 21600000,
    category: 'gia_su',
    program: '[THCS] Tiếng Anh IELTS',
    teacher: '1:1 - Phil',
    packageType: '72 buổi',
  },
  {
    code: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_48 buổi',
    name: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_48 buổi',
    subtext: 'Tiếng Anh IELTS - 1:1 - Phil - 48 buổi',
    price: 15400000,
    category: 'gia_su',
    program: '[THCS] Tiếng Anh IELTS',
    teacher: '1:1 - Phil',
    packageType: '48 buổi',
  },
  {
    code: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_24 buổi',
    name: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_24 buổi',
    subtext: 'Tiếng Anh IELTS - 1:1 - Phil - 24 buổi',
    price: 8200000,
    category: 'gia_su',
    program: '[THCS] Tiếng Anh IELTS',
    teacher: '1:1 - Phil',
    packageType: '24 buổi',
  },
  {
    code: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_1 buổi',
    name: '[TUTOR][THCS] Skill Booster 2.0 Phil_1:1_1 buổi',
    subtext: 'Tiếng Anh IELTS - 1:1 - Phil - 1 buổi',
    price: 450000,
    category: 'gia_su',
    program: '[THCS] Tiếng Anh IELTS',
    teacher: '1:1 - Phil',
    packageType: '1 buổi',
  },
  {
    code: '[TUTOR][THCS] Skill Builder 2.0 Phil_1:1_72 buổi',
    name: '[TUTOR][THCS] Skill Builder 2.0 Phil_1:1_72 buổi',
    subtext: 'Tiếng Anh IELTS - 1:1 - Phil - 72 buổi',
    price: 23500000,
    category: 'gia_su',
    program: '[THCS] Tiếng Anh IELTS',
    teacher: '1:1 - Phil',
    packageType: '72 buổi',
  },

  // ── SẢN PHẨM KHÓA HỌC ──
  {
    code: '[DUO] Gia hạn Toán 2 ( 1 năm )',
    name: '[DUO] Gia hạn Toán 2 ( 1 năm )',
    subtext: 'Toán học - 1 năm',
    price: 750000,
    category: 'khoa_hoc',
    program: '[THCS] Toán học',
    teacher: 'GV Khóa học',
    packageType: '1 năm',
  },
  {
    code: '[DUO] Tiếng anh ( 50 tháng )',
    name: '[DUO] Tiếng anh ( 50 tháng )',
    subtext: 'Tiếng Anh - Cơ bản, Lớp 1, 2, 3, 4, 5 - 50 tháng',
    price: 15000000,
    category: 'khoa_hoc',
    program: '[TIỂU HỌC] Tiếng Anh',
    teacher: 'GV Khóa học',
    packageType: '50 tháng',
  },
  {
    code: '[DUO] KHTN lớp 7-9 ( 3 năm )',
    name: '[DUO] KHTN lớp 7-9 ( 3 năm )',
    subtext: 'Lý - Lớp 7, 8, 9 - 38 tháng',
    price: 12500000,
    category: 'khoa_hoc',
    program: '[THCS] Khoa học tự nhiên',
    teacher: 'GV Khóa học',
    packageType: '3 năm',
  },
  {
    code: '[DUO] Tiếng việt tiểu học ( 50 tháng ) - để tạo combo',
    name: '[DUO] Tiếng việt tiểu học ( 50 tháng ) - để tạo combo',
    subtext: 'Tiếng Việt/Ngữ Văn - Cơ bản, Lớp 4, 5 - 50 tháng',
    price: 14000000,
    category: 'khoa_hoc',
    program: '[TIỂU HỌC] Tiếng Việt',
    teacher: 'GV Khóa học',
    packageType: '50 tháng',
  },
  {
    code: '[DUO] Tiếng anh ( 2 năm )',
    name: '[DUO] Tiếng anh ( 2 năm )',
    subtext: 'Tiếng Anh - Cơ bản, Lớp 1, 2, 3, 4, 5 - 26 tháng',
    price: 8500000,
    category: 'khoa_hoc',
    program: '[TIỂU HỌC] Tiếng Anh',
    teacher: 'GV Khóa học',
    packageType: '2 năm',
  },
  {
    code: '[Dùng thử] IELTS Conversation ( 1 tháng )',
    name: '[Dùng thử] IELTS Conversation ( 1 tháng )',
    subtext: 'Tiếng Anh - Cơ bản, Lớp 5 - 1 tháng',
    price: 500000,
    category: 'khoa_hoc',
    program: '[THCS] Tiếng Anh IELTS',
    teacher: 'GV Khóa học',
    packageType: '1 tháng',
  },

  // ── SẢN PHẨM COMBO ──
  {
    code: 'COMBO TIẾNG ANH CAM + TOÁN TƯ DUY EINSTEIN 1:6 (3 THÁNG) 2025',
    name: 'COMBO TIẾNG ANH CAM + TOÁN TƯ DUY EINSTEIN 1:6 (3 THÁNG) 2025',
    subtext: 'Gia sư (2) - Tiếng Anh + Toán tư duy',
    price: 5480000,
    category: 'combo',
    program: 'Combo Tiếng Anh + Toán',
    teacher: 'GV Gia sư (2)',
    packageType: '3 tháng',
    comboDetails: 'Bao gồm: 24 buổi Tiếng Anh Cambridge 1:1 + 12 buổi Toán tư duy Einstein 1:6 + Bộ giáo trình cứng',
  },
  {
    code: '[Station] Global Digi 96 buổi (2 Station + 2 Digi/ tuần)',
    name: '[Station] Global Digi 96 buổi (2 Station + 2 Digi/ tuần)',
    subtext: 'Gia sư (2) - Tiếng Anh',
    price: 19200000,
    category: 'combo',
    program: 'Combo Global Digi',
    teacher: 'GV Gia sư (2)',
    packageType: '96 buổi',
    comboDetails: 'Bao gồm: 48 buổi Station trực tiếp + 48 buổi Digi trực tuyến + Ứng dụng AI học tập',
  },
  {
    code: '[Tặng kèm không bán] Global Digi 8 buổi (8ST+8DG)',
    name: '[Tặng kèm không bán] Global Digi 8 buổi (8ST+8DG)',
    subtext: 'Gia sư (2) - Tiếng Anh',
    price: 0,
    category: 'combo',
    program: 'Quà tặng kèm',
    teacher: 'GV Gia sư (2)',
    packageType: '8 buổi',
    comboDetails: 'Quà tặng trải nghiệm: 8 buổi Station + 8 buổi Digi tự luyện',
  },
  {
    code: '[Station] Global Digi 192 buổi (2 station + 2 Digi/tuần)',
    name: '[Station] Global Digi 192 buổi (2 station + 2 Digi/tuần)',
    subtext: 'Gia sư (2) - Tiếng Anh',
    price: 35000000,
    category: 'combo',
    program: 'Combo Global Digi 192',
    teacher: 'GV Gia sư (2)',
    packageType: '192 buổi',
    comboDetails: 'Bao gồm: 96 buổi Station + 96 buổi Digi + Tặng iPad mini học tập',
  },
  {
    code: '[Station] Global Digi 288 buổi (2 station + 2 Digi/ Tuần)',
    name: '[Station] Global Digi 288 buổi (2 station + 2 Digi/ Tuần)',
    subtext: 'Gia sư (2) - Tiếng Anh',
    price: 48000000,
    category: 'combo',
    program: 'Combo Global Digi 288',
    teacher: 'GV Gia sư (2)',
    packageType: '288 buổi',
    comboDetails: 'Bao gồm: 144 buổi Station + 144 buổi Digi + Tặng iPad Air + Khóa luyện thi',
  },
]
