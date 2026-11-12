export type OrganizationType = 'family' | 'organization'

export interface OrganizationMember {
  id: string
  name: string
  role: 'parent' | 'student' | 'contact'
  relationship: string // 'Bố' | 'Mẹ' | 'Con' | 'Người đại diện' | 'Đầu mối liên hệ'
  phone?: string
  email?: string
  dob?: string
  studentCode?: string
  currentClass?: string
  status?: string
}

export interface Organization {
  id: string // FAM-10291 hoặc ORG-01
  code: string
  type: OrganizationType // 'family' (Hộ gia đình) | 'organization' (Tổ chức / Doanh nghiệp)
  name: string // Tên hộ gia đình hoặc tên doanh nghiệp/tổ chức
  familyName?: string // Alias tương thích
  category?: string // 'Hộ gia đình' | 'Trường học liên kết' | 'Doanh nghiệp B2B' | 'Tổ chức tài trợ'
  taxCode?: string

  // Người đại diện / Liên hệ chính (Luôn là cá nhân!)
  primaryContactName: string
  primaryParentName?: string // Alias tương thích
  primaryContactRole: string // 'Mẹ' | 'Bố' | 'Trưởng phòng' | 'Chủ tịch công đoàn'
  primaryParentRole?: 'Bố' | 'Mẹ' | 'Người giám hộ' // Alias tương thích
  primaryPhone: string
  primaryEmail?: string

  address: string
  branch: string
  nearestBranches?: Array<{ name: string; distance: string }>

  membersCount: {
    parents?: number
    children?: number
    students?: number
  }
  members: OrganizationMember[]

  totalSpent: number
  totalDebt: number
  tier: 'VIP' | 'Gold' | 'Standard'
  notes?: string
  assignedSale?: string
  assignedCsm?: string
  createdAt: string
  updatedAt: string
}

export const mockOrganizations: Organization[] = [
  // --- 1. HỘ GIA ĐÌNH ---
  {
    id: 'FAM-10291',
    code: 'FAM-10291',
    type: 'family',
    name: 'Gia đình Chị Hương Thảo & Anh Hùng',
    familyName: 'Gia đình Chị Hương Thảo & Anh Hùng',
    category: 'Hộ gia đình',
    primaryContactName: 'Đỗ Thị Hương Thảo',
    primaryParentName: 'Đỗ Thị Hương Thảo',
    primaryContactRole: 'Mẹ',
    primaryParentRole: 'Mẹ',
    primaryPhone: '0912888203',
    primaryEmail: 'thao.do@gmail.com',
    address: 'Phường Tây Mỗ, Quận Nam Từ Liêm, TP. Hà Nội',
    branch: 'CS6 Vinsmart Tonkin',
    nearestBranches: [
      { name: 'CS6 Vinsmart Tonkin', distance: '0.8 km' },
      { name: 'RinoEdu Smart City', distance: '2.5 km' },
    ],
    membersCount: { parents: 2, children: 1, students: 1 },
    members: [
      {
        id: 'p-thaodo',
        name: 'Đỗ Thị Hương Thảo',
        role: 'parent',
        relationship: 'Mẹ',
        phone: '0912888203',
        email: 'thao.do@gmail.com',
      },
      {
        id: 'p-hunghoang',
        name: 'Nguyễn Văn Hùng',
        role: 'parent',
        relationship: 'Bố',
        phone: '0912777203',
      },
      {
        id: 's-thaovy',
        name: 'Nguyễn Ngọc Thảo Vy',
        role: 'student',
        relationship: 'Con',
        studentCode: 'HV-00203',
        dob: '2020-03-12',
        currentClass: 'TK_TOAN_00015',
        status: 'active',
      },
    ],
    totalSpent: 36000000,
    totalDebt: 0,
    tier: 'VIP',
    notes: 'Phụ huynh rất quan tâm đến môi trường học và lộ trình Toán tư duy Archimedes.',
    assignedSale: 'Trần Thị Sale',
    assignedCsm: 'Lê Thị Chăm Sóc',
    createdAt: '2024-09-01T08:00:00Z',
    updatedAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'FAM-10292',
    code: 'FAM-10292',
    type: 'family',
    name: 'Gia đình Chị Thu Trang & Anh Sơn',
    familyName: 'Gia đình Chị Thu Trang & Anh Sơn',
    category: 'Hộ gia đình',
    primaryContactName: 'Nguyễn Thu Trang',
    primaryParentName: 'Nguyễn Thu Trang',
    primaryContactRole: 'Mẹ',
    primaryParentRole: 'Mẹ',
    primaryPhone: '0912345678',
    primaryEmail: 'thutrang.ng@gmail.com',
    address: 'Phường Nhân Chính, Quận Thanh Xuân, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    nearestBranches: [
      { name: 'RinoEdu Nguyễn Tuân', distance: '1.2 km' },
      { name: 'RinoEdu Linh Đàm', distance: '4.5 km' },
    ],
    membersCount: { parents: 2, children: 2, students: 2 },
    members: [
      {
        id: 'p-thutrang',
        name: 'Nguyễn Thu Trang',
        role: 'parent',
        relationship: 'Mẹ',
        phone: '0912345678',
        email: 'thutrang.ng@gmail.com',
      },
      {
        id: 'p-sonle',
        name: 'Lê Hoàng Sơn',
        role: 'parent',
        relationship: 'Bố',
        phone: '0988665544',
      },
      {
        id: 's-baohan',
        name: 'Lê Nguyễn Bảo Hân',
        role: 'student',
        relationship: 'Con',
        studentCode: 'HV-00321',
        dob: '2014-11-28',
        currentClass: 'TK_TIENGANH_00021',
        status: 'active',
      },
      {
        id: 's-baonam',
        name: 'Hoàng Bảo Nam',
        role: 'student',
        relationship: 'Con',
        studentCode: 'HV-00432',
        dob: '2013-05-20',
        currentClass: 'TK_TOAN_00008',
        status: 'active',
      },
    ],
    totalSpent: 48500000,
    totalDebt: 3200000,
    tier: 'VIP',
    notes: '2 bé cùng học tại chi nhánh Nguyễn Tuân, được hưởng chính sách giảm 10% học phí gia đình.',
    assignedSale: 'Trần Thị Sale',
    assignedCsm: 'Lê Thị Chăm Sóc',
    createdAt: '2024-08-14T09:30:00Z',
    updatedAt: '2026-04-01T15:00:00Z',
  },
  {
    id: 'FAM-10293',
    code: 'FAM-10293',
    type: 'family',
    name: 'Gia đình Anh Đỗ Quang Hùng',
    familyName: 'Gia đình Anh Đỗ Quang Hùng',
    category: 'Hộ gia đình',
    primaryContactName: 'Đỗ Quang Hùng',
    primaryParentName: 'Đỗ Quang Hùng',
    primaryContactRole: 'Bố',
    primaryParentRole: 'Bố',
    primaryPhone: '0912987889',
    primaryEmail: 'hung.do@fpt.com',
    address: '85 Vũ Trọng Phụng, Thanh Xuân Trung, Thanh Xuân, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    nearestBranches: [{ name: 'RinoEdu Nguyễn Tuân', distance: '0.5 km' }],
    membersCount: { parents: 1, children: 1, students: 1 },
    members: [
      {
        id: 'p-quanghung',
        name: 'Đỗ Quang Hùng',
        role: 'parent',
        relationship: 'Bố',
        phone: '0912987889',
        email: 'hung.do@fpt.com',
      },
      {
        id: 's-minhquan',
        name: 'Đỗ Minh Quân',
        role: 'student',
        relationship: 'Con',
        studentCode: 'HV-00543',
        dob: '2012-11-10',
        currentClass: 'TK_IELTS_00004',
        status: 'active',
      },
    ],
    totalSpent: 22000000,
    totalDebt: 0,
    tier: 'Gold',
    notes: 'Bố làm kỹ sư FPT, thường xuyên trao đổi qua email công việc.',
    assignedSale: 'Nguyễn Hoàng Sale',
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-04-10T11:30:00Z',
  },
  {
    id: 'FAM-10294',
    code: 'FAM-10294',
    type: 'family',
    name: 'Gia đình Anh Vũ Văn Nam',
    familyName: 'Gia đình Anh Vũ Văn Nam',
    category: 'Hộ gia đình',
    primaryContactName: 'Vũ Văn Nam',
    primaryParentName: 'Vũ Văn Nam',
    primaryContactRole: 'Bố',
    primaryParentRole: 'Bố',
    primaryPhone: '0987112024',
    primaryEmail: 'nam.vu@vietcombank.com.vn',
    address: 'Khu đô thị Bán đảo Linh Đàm, Hoàng Mai, Hà Nội',
    branch: 'RinoEdu Linh Đàm',
    nearestBranches: [{ name: 'RinoEdu Linh Đàm', distance: '1.0 km' }],
    membersCount: { parents: 1, children: 1, students: 1 },
    members: [
      {
        id: 'p-vannam',
        name: 'Vũ Văn Nam',
        role: 'parent',
        relationship: 'Bố',
        phone: '0987112024',
        email: 'nam.vu@vietcombank.com.vn',
      },
      {
        id: 's-thaonhi',
        name: 'Vũ Thảo Nhi',
        role: 'student',
        relationship: 'Con',
        studentCode: 'HV-00678',
        dob: '2015-08-22',
        currentClass: 'TK_CAMBRIDGE_00012',
        status: 'active',
      },
    ],
    totalSpent: 16500000,
    totalDebt: 0,
    tier: 'Standard',
    notes: 'Bé đã học thử 2 buổi và hoàn tất đăng ký lớp Tiếng Anh Level 4.',
    assignedSale: 'Nguyễn Hoàng Sale',
    createdAt: '2026-07-25T14:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z',
  },

  // --- 2. TỔ CHỨC / DOANH NGHIỆP LIÊN KẾT ---
  {
    id: 'ORG-B2B-01',
    code: 'ORG-01',
    type: 'organization',
    name: 'Trường Phổ thông Song ngữ Vinschool Smart City',
    familyName: 'Trường Phổ thông Song ngữ Vinschool Smart City',
    category: 'Trường học liên kết',
    taxCode: '0106889911',
    primaryContactName: 'Bà Nguyễn Mai Phương',
    primaryParentName: 'Bà Nguyễn Mai Phương',
    primaryContactRole: 'Trưởng ban Hợp tác Ngoại khóa',
    primaryParentRole: 'Người giám hộ',
    primaryPhone: '0904112233',
    primaryEmail: 'phuong.nm@vinschool.edu.vn',
    address: 'Khu đô thị Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    branch: 'RinoEdu Smart City',
    nearestBranches: [{ name: 'RinoEdu Smart City', distance: '0.4 km' }],
    membersCount: { students: 35 },
    members: [
      {
        id: 'org-c1',
        name: 'Bà Nguyễn Mai Phương',
        role: 'contact',
        relationship: 'Trưởng ban Hợp tác Ngoại khóa',
        phone: '0904112233',
        email: 'phuong.nm@vinschool.edu.vn',
      },
    ],
    totalSpent: 185000000,
    totalDebt: 0,
    tier: 'VIP',
    notes: 'Hợp đồng liên kết CLB STEM Robotics & Tiếng Anh học thuật cho 35 học sinh khối THCS.',
    assignedSale: 'Trần Thị Sale',
    createdAt: '2024-07-15T08:00:00Z',
    updatedAt: '2026-01-10T14:00:00Z',
  },
  {
    id: 'ORG-B2B-02',
    code: 'ORG-02',
    type: 'organization',
    name: 'Công ty Cổ phần Phần mềm FPT Software',
    familyName: 'Công ty Cổ phần Phần mềm FPT Software',
    category: 'Doanh nghiệp B2B',
    taxCode: '0101234567',
    primaryContactName: 'Ông Trần Trọng Tín',
    primaryParentName: 'Ông Trần Trọng Tín',
    primaryContactRole: 'Chủ tịch Công đoàn & Phúc lợi nhân sự',
    primaryParentRole: 'Người giám hộ',
    primaryPhone: '0918776655',
    primaryEmail: 'tin.tt@fpt.com',
    address: 'Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    nearestBranches: [{ name: 'RinoEdu Nguyễn Tuân', distance: '2.5 km' }],
    membersCount: { students: 28 },
    members: [
      {
        id: 'org-c2',
        name: 'Ông Trần Trọng Tín',
        role: 'contact',
        relationship: 'Chủ tịch Công đoàn & Phúc lợi',
        phone: '0918776655',
        email: 'tin.tt@fpt.com',
      },
    ],
    totalSpent: 120000000,
    totalDebt: 15000000,
    tier: 'Gold',
    notes: 'Gói phúc lợi học phí Tiếng Anh và Toán tư duy tài trợ cho con em cán bộ nhân viên FPT Software.',
    assignedSale: 'Trần Thị Sale',
    createdAt: '2024-05-10T09:00:00Z',
    updatedAt: '2026-02-15T11:00:00Z',
  },
  {
    id: 'ORG-B2B-03',
    code: 'ORG-03',
    type: 'organization',
    name: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) - Hội sở',
    familyName: 'Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank) - Hội sở',
    category: 'Doanh nghiệp B2B',
    taxCode: '0100112437',
    primaryContactName: 'Bà Lê Thúy Hằng',
    primaryParentName: 'Bà Lê Thúy Hằng',
    primaryContactRole: 'Phó Giám đốc Khối Nhân sự',
    primaryParentRole: 'Người giám hộ',
    primaryPhone: '0903889911',
    primaryEmail: 'hang.lt@vietcombank.com.vn',
    address: '198 Trần Quang Khải, Hoàn Kiếm, Hà Nội',
    branch: 'RinoEdu Linh Đàm',
    nearestBranches: [{ name: 'RinoEdu Linh Đàm', distance: '5.0 km' }],
    membersCount: { students: 20 },
    members: [
      {
        id: 'org-c3',
        name: 'Bà Lê Thúy Hằng',
        role: 'contact',
        relationship: 'Phó Giám đốc Khối Nhân sự',
        phone: '0903889911',
        email: 'hang.lt@vietcombank.com.vn',
      },
    ],
    totalSpent: 90000000,
    totalDebt: 0,
    tier: 'Gold',
    notes: 'Chương trình trại hè tiếng Anh bán trú độc quyền cho con em cán bộ nhân viên Vietcombank.',
    assignedSale: 'Nguyễn Hoàng Sale',
    createdAt: '2024-11-01T08:30:00Z',
    updatedAt: '2026-03-20T16:00:00Z',
  },
  {
    id: 'ORG-B2B-04',
    code: 'ORG-04',
    type: 'organization',
    name: 'Trường Mầm non Quốc tế Sakura Montessori',
    familyName: 'Trường Mầm non Quốc tế Sakura Montessori',
    category: 'Trường học liên kết',
    taxCode: '0107886633',
    primaryContactName: 'Bà Hoàng Minh Thu',
    primaryParentName: 'Bà Hoàng Minh Thu',
    primaryContactRole: 'Hiệu trưởng cơ sở',
    primaryParentRole: 'Người giám hộ',
    primaryPhone: '0989223344',
    primaryEmail: 'hieu.truong@sakuramontessori.edu.vn',
    address: 'Lô A/D13 KĐT Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội',
    branch: 'RinoEdu Smart City',
    nearestBranches: [{ name: 'RinoEdu Smart City', distance: '3.0 km' }],
    membersCount: { students: 18 },
    members: [
      {
        id: 'org-c4',
        name: 'Bà Hoàng Minh Thu',
        role: 'contact',
        relationship: 'Hiệu trưởng cơ sở',
        phone: '0989223344',
        email: 'hieu.truong@sakuramontessori.edu.vn',
      },
    ],
    totalSpent: 65000000,
    totalDebt: 5000000,
    tier: 'Standard',
    notes: 'Liên kết chuyển tiếp học sinh tiền tiểu học lên lớp Toán tư duy và Tiếng Anh ngữ âm.',
    assignedSale: 'Trần Thị Sale',
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2026-04-05T09:00:00Z',
  },
]

// Alias tương thích ngược 100%
export type Household = Organization
export type HouseholdMember = OrganizationMember
export const mockHouseholds: Household[] = mockOrganizations

export function getOrganizations(filters?: {
  search?: string
  branch?: string
  type?: string
  tier?: string
}): Organization[] {
  return mockOrganizations.filter((org) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matchName = org.name.toLowerCase().includes(q)
      const matchCode = org.code.toLowerCase().includes(q)
      const matchParent = org.primaryContactName.toLowerCase().includes(q)
      const matchPhone = org.primaryPhone.includes(filters.search)
      const matchTax = org.taxCode?.includes(filters.search)
      const matchAddress = org.address.toLowerCase().includes(q)
      if (!matchName && !matchCode && !matchParent && !matchPhone && !matchTax && !matchAddress) {
        return false
      }
    }
    if (filters?.branch && filters.branch !== 'all' && org.branch !== filters.branch) {
      return false
    }
    if (filters?.type && filters.type !== 'all' && org.type !== filters.type) {
      return false
    }
    if (filters?.tier && filters.tier !== 'all' && org.tier !== filters.tier) {
      return false
    }
    return true
  })
}

export function getHouseholds(filters?: {
  search?: string
  branch?: string
  tier?: string
}): Household[] {
  return getOrganizations(filters)
}
