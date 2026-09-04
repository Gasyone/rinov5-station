export type ParentRole = 'Mẹ' | 'Bố' | 'Ông' | 'Bà' | 'Khác' | string

export interface ParentItem {
  id: string
  name: string
  phone: string
  email: string
  role: ParentRole
  customRole?: string
  secondaryPhone?: string
  isCollapsed: boolean
}

export interface ChildItem {
  id: string
  name: string
  currentSchool: string
  birthYear: string
  age: string
  academicPerformance: string
  phone: string
  course: string
  vuihocAccount: string
  isCollapsed: boolean
}

export interface StaffOption {
  id: string
  name: string
  role: string
  avatar: string
}

export const PARENT_ROLE_CHIPS = [
  'Mẹ',
  'Bố',
  'Ông',
  'Bà',
  'Khác',
] as const

export const LOAI_HINH_OPTIONS = [
  { value: 'Tự học', label: 'Tự học' },
  { value: 'Gia sư', label: 'Gia sư' },
  { value: 'Gia hạn - Upsale', label: 'Gia hạn - Upsale' },
  { value: 'IELTS X', label: 'IELTS X' },
  { value: 'Station', label: 'Station' },
  { value: 'RINO DIGI', label: 'RINO DIGI' },
  { value: 'Backup', label: 'Backup' },
]

export const NHOM_NGANH_OPTIONS = [
  { value: 'Tiểu học', label: 'Tiểu học' },
  { value: 'THCS', label: 'THCS' },
  { value: 'THPT', label: 'THPT' },
]

export const NGUON_KHACH_HANG_OPTIONS = [
  'App Digital Teacher',
  'Web Rinoedu',
  'Station_Sale',
  'VNEschool',
  'Web Hellomath',
  'Web Tutor',
  'DUO Tiểu học',
  'Đại Lý',
  'Tienganh new',
  'Tiểu học New',
  'Cấp 2',
  'Tienganh',
]

export const BIRTH_YEAR_OPTIONS = [
  '2026', '2025', '2024', '2023', '2022', '2021',
  '2020', '2019', '2018', '2017', '2016', '2015',
  '2014', '2013', '2012', '2011', '2010', '2009', '2008'
].map((y) => ({ value: y, label: y }))

export const POPULAR_SCHOOL_OPTIONS = [
  { value: 'Tiểu học Lê Quý Đôn', label: 'Tiểu học Lê Quý Đôn' },
  { value: 'Tiểu học Vinschool', label: 'Tiểu học Vinschool' },
  { value: 'THCS Vinschool', label: 'THCS Vinschool' },
  { value: 'Tiểu học Nguyễn Huệ', label: 'Tiểu học Nguyễn Huệ' },
  { value: 'Tiểu học Chu Văn An', label: 'Tiểu học Chu Văn An' },
  { value: 'THCS Chu Văn An', label: 'THCS Chu Văn An' },
  { value: 'Tiểu học Đinh Tiên Hoàng', label: 'Tiểu học Đinh Tiên Hoàng' },
  { value: 'Tiểu học Lương Định Của', label: 'Tiểu học Lương Định Của' },
  { value: 'Tiểu học Thực Nghiệm', label: 'Tiểu học Thực Nghiệm' },
  { value: 'Mầm non Sao Mai', label: 'Mầm non Sao Mai' },
  { value: 'THCS Lê Hồng Phong', label: 'THCS Lê Hồng Phong' },
  { value: 'THCS Đoàn Thị Điểm', label: 'THCS Đoàn Thị Điểm' },
]

export const PROVINCE_OPTIONS = [
  { value: 'TP. Hồ Chí Minh', label: 'TP. Hồ Chí Minh' },
  { value: 'Hà Nội', label: 'Hà Nội' },
  { value: 'Đà Nẵng', label: 'Đà Nẵng' },
  { value: 'Hải Phòng', label: 'Hải Phòng' },
  { value: 'Cần Thơ', label: 'Cần Thơ' },
  { value: 'Bình Dương', label: 'Bình Dương' },
]

export const DISTRICT_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  'Hà Nội': [
    { value: 'Cầu Giấy', label: 'Cầu Giấy' },
    { value: 'Ba Đình', label: 'Ba Đình' },
    { value: 'Đống Đa', label: 'Đống Đa' },
    { value: 'Thanh Xuân', label: 'Thanh Xuân' },
    { value: 'Nam Từ Liêm', label: 'Nam Từ Liêm' },
    { value: 'Hoàn Kiếm', label: 'Hoàn Kiếm' },
    { value: 'Hai Bà Trưng', label: 'Hai Bà Trưng' },
    { value: 'Hà Đông', label: 'Hà Đông' },
  ],
  'TP. Hồ Chí Minh': [
    { value: 'Quận 1', label: 'Quận 1' },
    { value: 'Quận 3', label: 'Quận 3' },
    { value: 'Quận 7', label: 'Quận 7' },
    { value: 'TP. Thủ Đức', label: 'TP. Thủ Đức' },
    { value: 'Bình Thạnh', label: 'Bình Thạnh' },
    { value: 'Phú Nhuận', label: 'Phú Nhuận' },
    { value: 'Tân Bình', label: 'Tân Bình' },
    { value: 'Quận 10', label: 'Quận 10' },
  ],
}

export const WARD_OPTIONS: Record<string, Array<{ value: string; label: string }>> = {
  'Quận 1': [
    { value: 'Phường Bến Nghé', label: 'Phường Bến Nghé' },
    { value: 'Phường Bến Thành', label: 'Phường Bến Thành' },
    { value: 'Phường Đa Kao', label: 'Phường Đa Kao' },
    { value: 'Phường Tân Định', label: 'Phường Tân Định' },
    { value: 'Phường Phạm Ngũ Lão', label: 'Phường Phạm Ngũ Lão' },
  ],
  'Cầu Giấy': [
    { value: 'Phường Dịch Vọng', label: 'Phường Dịch Vọng' },
    { value: 'Phường Dịch Vọng Hậu', label: 'Phường Dịch Vọng Hậu' },
    { value: 'Phường Nghĩa Tân', label: 'Phường Nghĩa Tân' },
    { value: 'Phường Quan Hoa', label: 'Phường Quan Hoa' },
    { value: 'Phường Yên Hòa', label: 'Phường Yên Hòa' },
  ],
}

export const DEFAULT_WARDS = [
  { value: 'Phường Bến Nghé', label: 'Phường Bến Nghé' },
  { value: 'Phường Đa Kao', label: 'Phường Đa Kao' },
  { value: 'Phường Dịch Vọng', label: 'Phường Dịch Vọng' },
  { value: 'Phường Nghĩa Tân', label: 'Phường Nghĩa Tân' },
  { value: 'Phường Thảo Điền', label: 'Phường Thảo Điền' },
]

export const COURSE_OPTIONS = [
  { value: 'Anh văn Nhi đồng (SuperKids)', label: 'Anh văn Nhi đồng (SuperKids)' },
  { value: 'Anh văn Mẫu giáo (Kindy)', label: 'Anh văn Mẫu giáo (Kindy)' },
  { value: 'Luyện thi Flyers', label: 'Luyện thi Flyers' },
  { value: 'Luyện thi Starters', label: 'Luyện thi Starters' },
  { value: 'Luyện thi Movers', label: 'Luyện thi Movers' },
  { value: 'Luyện thi IELTS Junior', label: 'Luyện thi IELTS Junior' },
  { value: 'Luyện thi IELTS 6.5+', label: 'Luyện thi IELTS 6.5+' },
  { value: 'Toán Tư Duy', label: 'Toán Tư Duy' },
]

export const STAFF_LIST: StaffOption[] = [
  { id: '1', name: 'Trần Thị Mai', role: 'Sales', avatar: 'TM' },
  { id: '2', name: 'Lê Hoàng Nam', role: 'Sales', avatar: 'HN' },
  { id: '3', name: 'Nguyễn Văn Hùng', role: 'Sales Manager', avatar: 'VH' },
  { id: '4', name: 'Phạm Thị Thúy', role: 'Sales', avatar: 'TT' },
  { id: '5', name: 'Nguyễn Thị Lan', role: 'Marketing', avatar: 'NL' },
  { id: '6', name: 'Phạm Hữu Đạt', role: 'Marketing', avatar: 'HĐ' },
]

export const MARKETING_STAFF_OPTIONS = [
  { value: 'Nguyễn Thị Lan (Marketing)', label: 'Nguyễn Thị Lan (Marketing)' },
  { value: 'Phạm Hữu Đạt (Marketing)', label: 'Phạm Hữu Đạt (Marketing)' },
  { value: 'Hoàng Minh Châu (Marketing)', label: 'Hoàng Minh Châu (Marketing)' },
  { value: 'Tự động từ chiến dịch', label: 'Tự động từ chiến dịch' },
]

export const PRODUCT_GROUP_OPTIONS = [
  'Station MKT',
  'Station KD Vùng',
  'Station Vin',
  'Station Tonkin',
  'Station Tokin',
  'Station Nguyễn Tuân',
  'Tiếng Anh Thiếu Nhi',
  'Luyện Thi IELTS',
  'Toán Tư Duy',
]
