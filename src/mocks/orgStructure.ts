export type OrgUnitType = 'board' | 'block' | 'region' | 'branch' | 'department' | 'team'

export interface OrgStaffMember {
  id: string
  name: string
  title: string
  role: string
  isPrimary: boolean
  phone: string
  email: string
  joinedDate: string
  avatar?: string
}

export interface OrgUnit {
  id: string
  code: string
  name: string
  type: OrgUnitType
  typeLabel: string
  parentId: string | null
  leaderId?: string
  leaderName?: string
  leaderTitle?: string
  leaderAvatar?: string
  leaderEmail?: string
  leaderPhone?: string
  memberCount: number
  status: 'active' | 'inactive'
  statusLabel: string
  branchId?: string
  description: string
  positions?: string[]
  members: OrgStaffMember[]
  createdAt: string
  updatedAt: string
}

export const mockOrgUnits: OrgUnit[] = [
  {
    id: 'org-bod',
    code: 'BOD',
    name: 'Hội đồng Quản trị & Ban Tổng Giám đốc',
    type: 'board',
    typeLabel: 'Ban Giám đốc',
    parentId: null,
    leaderId: 'emp-001',
    leaderName: 'Trần Văn Mạnh',
    leaderTitle: 'Tổng Giám đốc (CEO)',
    leaderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    leaderEmail: 'manh.tv@rinoedu.vn',
    leaderPhone: '0903 111 222',
    memberCount: 5,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Cơ quan lãnh đạo chiến lược và điều hành cao nhất của RinoEdu.',
    positions: ['Tổng Giám đốc (CEO)', 'Phó Tổng Giám đốc (COO)', 'Giám đốc Học thuật (Academic Director)'],
    members: [
      { id: 'emp-001', name: 'Trần Văn Mạnh', title: 'Tổng Giám đốc (CEO)', role: 'Ban Điều hành', isPrimary: true, phone: '0903 111 222', email: 'manh.tv@rinoedu.vn', joinedDate: '2022-01-01' },
      { id: 'emp-002', name: 'Lê Thu Trang', title: 'Phó Tổng Giám đốc (COO)', role: 'Ban Điều hành', isPrimary: true, phone: '0904 222 333', email: 'trang.lt@rinoedu.vn', joinedDate: '2022-03-15' },
      { id: 'emp-003', name: 'Hoàng Minh Tuấn', title: 'Giám đốc Học thuật (Academic Director)', role: 'Ban Điều hành', isPrimary: true, phone: '0905 333 444', email: 'tuan.hm@rinoedu.vn', joinedDate: '2022-06-01' },
    ],
    createdAt: '2022-01-01',
    updatedAt: '2026-01-10',
  },
  {
    id: 'org-academic-ops-block',
    code: 'OPS_BLOCK',
    name: 'Khối Vận hành & Đào tạo',
    type: 'block',
    typeLabel: 'Khối',
    parentId: 'org-bod',
    leaderId: 'emp-002',
    leaderName: 'Lê Thu Trang',
    leaderTitle: 'Phó Tổng Giám đốc Vận hành (COO)',
    leaderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    leaderEmail: 'trang.lt@rinoedu.vn',
    leaderPhone: '0904 222 333',
    memberCount: 68,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Chịu trách nhiệm toàn bộ công tác đào tạo, chất lượng giảng dạy và vận hành trung tâm.',
    positions: ['Khối trưởng Vận hành', 'Phó Khối Đào tạo', 'Điều phối viên Học vụ'],
    members: [
      { id: 'emp-002', name: 'Lê Thu Trang', title: 'Khối trưởng Vận hành', role: 'Quản lý', isPrimary: true, phone: '0904 222 333', email: 'trang.lt@rinoedu.vn', joinedDate: '2022-03-15' },
    ],
    createdAt: '2022-03-15',
    updatedAt: '2026-02-01',
  },
  {
    id: 'org-qa-academic',
    code: 'ACAD_QA',
    name: 'Ban Đào tạo & Quản lý Chất lượng (QA)',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-academic-ops-block',
    leaderId: 'emp-003',
    leaderName: 'Hoàng Minh Tuấn',
    leaderTitle: 'Trưởng ban Đào tạo',
    leaderEmail: 'tuan.hm@rinoedu.vn',
    leaderPhone: '0905 333 444',
    memberCount: 12,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Biên soạn giáo trình, kiểm định chất lượng giờ dạy và đào tạo sư phạm giáo viên.',
    positions: ['Trưởng ban Đào tạo', 'Chuyên viên Kiểm định Giảng dạy (QA)', 'Nghiên cứu & Phát triển Giáo trình (R&D)'],
    members: [
      { id: 'emp-003', name: 'Hoàng Minh Tuấn', title: 'Trưởng ban Đào tạo', role: 'Quản lý', isPrimary: true, phone: '0905 333 444', email: 'tuan.hm@rinoedu.vn', joinedDate: '2022-06-01' },
      { id: 'emp-qa-01', name: 'Nguyễn Bích Thảo', title: 'Chuyên viên Kiểm định Giảng dạy (QA)', role: 'Chuyên viên', isPrimary: true, phone: '0916 555 777', email: 'thao.nb@rinoedu.vn', joinedDate: '2023-04-10' },
      { id: 'emp-qa-02', name: 'Đặng Mai Phương', title: 'Nghiên cứu & Phát triển Giáo trình (R&D)', role: 'Chuyên viên', isPrimary: true, phone: '0917 888 999', email: 'phuong.dm@rinoedu.vn', joinedDate: '2023-09-01' },
    ],
    createdAt: '2022-06-01',
    updatedAt: '2026-01-15',
  },
  {
    id: 'org-region-north',
    code: 'REG_NORTH',
    name: 'Vùng Miền Bắc (Hà Nội & Lân cận)',
    type: 'region',
    typeLabel: 'Vùng',
    parentId: 'org-academic-ops-block',
    leaderId: 'emp-004',
    leaderName: 'Nguyễn Văn An',
    leaderTitle: 'Giám đốc Vùng Miền Bắc',
    leaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    leaderEmail: 'an.nv@rinoedu.vn',
    leaderPhone: '0988 123 456',
    memberCount: 56,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Điều hành mạng lưới các trung tâm đào tạo tại khu vực miền Bắc.',
    positions: ['Giám đốc Vùng', 'Chuyên viên Vận hành Vùng', 'Điều phối viên Quản lý Chi nhánh'],
    members: [
      { id: 'emp-004', name: 'Nguyễn Văn An', title: 'Giám đốc Vùng', role: 'Quản lý', isPrimary: true, phone: '0988 123 456', email: 'an.nv@rinoedu.vn', joinedDate: '2023-01-10' },
    ],
    createdAt: '2023-01-10',
    updatedAt: '2026-02-15',
  },
  {
    id: 'org-branch-linh-dam',
    code: 'BR_LINHDAM',
    name: 'Chi nhánh RinoEdu Linh Đàm',
    type: 'branch',
    typeLabel: 'Chi nhánh',
    parentId: 'org-region-north',
    leaderId: 'emp-004',
    leaderName: 'Nguyễn Văn An',
    leaderTitle: 'Giám đốc Chi nhánh (Branch Manager)',
    leaderEmail: 'an.nv@rinoedu.vn',
    leaderPhone: '0988 123 456',
    memberCount: 22,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    branchId: 'br-linh-dam',
    description: 'Cơ sở đào tạo chuẩn quốc tế tại Rice City Linh Đàm, Hoàng Mai.',
    positions: ['Giám đốc Chi nhánh', 'Trưởng nhóm CSKH & Học vụ', 'Chuyên viên Tư vấn Tuyển sinh', 'Giáo viên Tiếng Anh'],
    members: [
      { id: 'emp-004', name: 'Nguyễn Văn An', title: 'Giám đốc Chi nhánh', role: 'Quản lý', isPrimary: true, phone: '0988 123 456', email: 'an.nv@rinoedu.vn', joinedDate: '2023-01-10' },
      { id: 'emp-gv-01', name: 'Cô Mai Lan', title: 'Giáo viên Tiếng Anh', role: 'Giảng dạy', isPrimary: true, phone: '0983 234 567', email: 'lan.cm@rinoedu.vn', joinedDate: '2023-02-01' },
      { id: 'emp-cs-01', name: 'Bùi Ánh Tuyết', title: 'Trưởng nhóm CSKH & Học vụ', role: 'Vận hành', isPrimary: true, phone: '0974 345 678', email: 'tuyet.ba@rinoedu.vn', joinedDate: '2023-03-15' },
    ],
    createdAt: '2023-02-01',
    updatedAt: '2026-02-20',
  },
  {
    id: 'org-team-acad-ld',
    code: 'TEAM_ACAD_LD',
    name: 'Tổ Học vụ & Giảng dạy - Linh Đàm',
    type: 'team',
    typeLabel: 'Tổ / Nhóm',
    parentId: 'org-branch-linh-dam',
    leaderId: 'emp-gv-01',
    leaderName: 'Cô Mai Lan',
    leaderTitle: 'Tổ trưởng Sư phạm',
    leaderEmail: 'lan.cm@rinoedu.vn',
    leaderPhone: '0983 234 567',
    memberCount: 14,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    branchId: 'br-linh-dam',
    description: 'Đội ngũ giáo viên chính, trợ giảng và điều phối ca giảng dạy cơ sở Linh Đàm.',
    positions: ['Tổ trưởng Giáo viên', 'Giáo viên Tiếng Anh', 'Giáo viên Toán Tiếng Anh', 'Trợ giảng'],
    members: [
      { id: 'emp-gv-01', name: 'Cô Mai Lan', title: 'Tổ trưởng Giáo viên', role: 'Giảng dạy', isPrimary: true, phone: '0983 234 567', email: 'lan.cm@rinoedu.vn', joinedDate: '2023-02-01' },
      { id: 'emp-gv-02', name: 'Thầy Quang Huy', title: 'Giáo viên Toán Tiếng Anh', role: 'Giảng dạy', isPrimary: true, phone: '0962 456 789', email: 'huy.tq@rinoedu.vn', joinedDate: '2023-05-10' },
      { id: 'emp-ta-01', name: 'Phạm Hồng Nhung', title: 'Trợ giảng Trưởng ca', role: 'Trợ giảng', isPrimary: true, phone: '0915 678 901', email: 'nhung.ph@rinoedu.vn', joinedDate: '2024-01-15' },
    ],
    createdAt: '2023-03-01',
    updatedAt: '2026-02-10',
  },
  {
    id: 'org-branch-nguyen-tuan',
    code: 'BR_NGUYENTUAN',
    name: 'Chi nhánh RinoEdu Nguyễn Tuân',
    type: 'branch',
    typeLabel: 'Chi nhánh',
    parentId: 'org-region-north',
    leaderId: 'emp-005',
    leaderName: 'Trần Thị Bích',
    leaderTitle: 'Giám đốc Chi nhánh (Branch Manager)',
    leaderEmail: 'bich.tt@rinoedu.vn',
    leaderPhone: '0977 234 567',
    memberCount: 18,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    branchId: 'br-nguyen-tuan',
    description: 'Cơ sở đào tạo tại 90 Nguyễn Tuân, quận Thanh Xuân.',
    positions: ['Giám đốc Chi nhánh', 'Giáo viên Cambridge', 'Chuyên viên Tư vấn Tuyển sinh', 'Trợ giảng'],
    members: [
      { id: 'emp-005', name: 'Trần Thị Bích', title: 'Giám đốc Chi nhánh', role: 'Quản lý', isPrimary: true, phone: '0977 234 567', email: 'bich.tt@rinoedu.vn', joinedDate: '2023-06-01' },
      { id: 'emp-gv-03', name: 'Thầy Lê Hải', title: 'Giáo viên Cambridge', role: 'Giảng dạy', isPrimary: true, phone: '0908 789 012', email: 'hai.lh@rinoedu.vn', joinedDate: '2023-07-15' },
    ],
    createdAt: '2023-06-01',
    updatedAt: '2026-01-20',
  },
  {
    id: 'org-branch-smart-city',
    code: 'BR_SMARTCITY',
    name: 'Chi nhánh RinoEdu Smart City',
    type: 'branch',
    typeLabel: 'Chi nhánh',
    parentId: 'org-region-north',
    leaderId: 'emp-006',
    leaderName: 'Lê Hoàng Long',
    leaderTitle: 'Giám đốc Chi nhánh (Branch Manager)',
    leaderEmail: 'long.lh@rinoedu.vn',
    leaderPhone: '0966 345 678',
    memberCount: 16,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    branchId: 'br-smart-city',
    description: 'Cơ sở trải nghiệm STEAM và Tiếng Anh tại Vinhomes Smart City.',
    positions: ['Giám đốc Chi nhánh', 'Giáo viên STEAM & Tiếng Anh', 'Chuyên viên Tư vấn Tuyển sinh'],
    members: [
      { id: 'emp-006', name: 'Lê Hoàng Long', title: 'Giám đốc Chi nhánh', role: 'Quản lý', isPrimary: true, phone: '0966 345 678', email: 'long.lh@rinoedu.vn', joinedDate: '2023-09-01' },
    ],
    createdAt: '2023-09-01',
    updatedAt: '2026-02-05',
  },
  {
    id: 'org-commercial-block',
    code: 'COMM_BLOCK',
    name: 'Khối Kinh doanh & Tuyển sinh',
    type: 'block',
    typeLabel: 'Khối',
    parentId: 'org-bod',
    leaderId: 'emp-007',
    leaderName: 'Vũ Quốc Khánh',
    leaderTitle: 'Giám đốc Kinh doanh Toàn quốc (CCO)',
    leaderEmail: 'khanh.vq@rinoedu.vn',
    leaderPhone: '0934 567 890',
    memberCount: 35,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Quản lý chiến lược tiếp thị, tư vấn tuyển sinh và phát triển doanh số toàn hệ thống.',
    positions: ['Giám đốc Kinh doanh Toàn quốc (CCO)', 'Trưởng phòng Phát triển Đối tác', 'Điều phối viên Tuyển sinh'],
    members: [
      { id: 'emp-007', name: 'Vũ Quốc Khánh', title: 'Giám đốc Kinh doanh Toàn quốc (CCO)', role: 'Quản lý', isPrimary: true, phone: '0934 567 890', email: 'khanh.vq@rinoedu.vn', joinedDate: '2022-08-01' },
    ],
    createdAt: '2022-08-01',
    updatedAt: '2026-01-10',
  },
  {
    id: 'org-dept-marketing',
    code: 'DEPT_MKT',
    name: 'Phòng Marketing & Thương hiệu',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-commercial-block',
    leaderId: 'emp-008',
    leaderName: 'Hoàng Diệu Ly',
    leaderTitle: 'Trưởng phòng Marketing',
    leaderEmail: 'ly.hd@rinoedu.vn',
    leaderPhone: '0945 678 901',
    memberCount: 10,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Chạy quảng cáo đa kênh, tổ chức sự kiện workshop và quản lý thương hiệu RinoEdu.',
    positions: ['Trưởng phòng Marketing', 'Chuyên viên Content Creator', 'Chuyên viên Digital Ads', 'Graphic Designer'],
    members: [
      { id: 'emp-008', name: 'Hoàng Diệu Ly', title: 'Trưởng phòng Marketing', role: 'Quản lý', isPrimary: true, phone: '0945 678 901', email: 'ly.hd@rinoedu.vn', joinedDate: '2023-02-15' },
    ],
    createdAt: '2023-02-15',
    updatedAt: '2026-02-15',
  },
  {
    id: 'org-dept-sales-pool',
    code: 'DEPT_SALES',
    name: 'Phòng Tuyển sinh & Tư vấn Học viên',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-commercial-block',
    leaderId: 'emp-009',
    leaderName: 'Đỗ Tuấn Kiệt',
    leaderTitle: 'Trưởng phòng Tuyển sinh',
    leaderEmail: 'kiet.dt@rinoedu.vn',
    leaderPhone: '0912 345 678',
    memberCount: 25,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Tiếp nhận Lead, tư vấn khóa học, đặt lịch test đầu vào và chốt đơn học phí.',
    positions: ['Trưởng phòng Tuyển sinh', 'Trưởng nhóm Telesale', 'Chuyên viên Tư vấn Tuyển sinh'],
    members: [
      { id: 'emp-009', name: 'Đỗ Tuấn Kiệt', title: 'Trưởng phòng Tuyển sinh', role: 'Quản lý', isPrimary: true, phone: '0912 345 678', email: 'kiet.dt@rinoedu.vn', joinedDate: '2023-03-01' },
      { id: 'emp-sale-01', name: 'Nguyễn Thu Hà', title: 'Chuyên viên Tư vấn Tuyển sinh', role: 'Tư vấn', isPrimary: true, phone: '0989 111 333', email: 'ha.nt@rinoedu.vn', joinedDate: '2023-04-15' },
    ],
    createdAt: '2023-03-01',
    updatedAt: '2026-02-18',
  },
  {
    id: 'org-dept-cs',
    code: 'DEPT_CS',
    name: 'Phòng Chăm sóc Khách hàng & Học viên',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-academic-ops-block',
    leaderId: 'e5',
    leaderName: 'Lê Thị Chăm Sóc',
    leaderTitle: 'Trưởng phòng Chăm sóc Khách hàng',
    leaderEmail: 'csm1@demo.com',
    leaderPhone: '0902 223 344',
    memberCount: 8,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Quản lý công tác chăm sóc học viên, tiếp nhận phản ánh và tư vấn lộ trình học tập.',
    positions: ['Trưởng phòng Chăm sóc Khách hàng', 'Chuyên viên Chăm sóc Khách hàng'],
    members: [
      { id: 'e5', name: 'Lê Thị Chăm Sóc', title: 'Trưởng phòng CSKH', role: 'Quản lý', isPrimary: true, phone: '0902 223 344', email: 'csm1@demo.com', joinedDate: '2024-01-10' },
      { id: 'sc3', name: 'Phạm Mai Anh', title: 'Chuyên viên CSKH', role: 'Chuyên viên', isPrimary: true, phone: '0905 678 901', email: 'maianh.sc@demo.com', joinedDate: '2024-04-01' },
    ],
    createdAt: '2023-04-01',
    updatedAt: '2026-02-10',
  },
  {
    id: 'org-dept-finance',
    code: 'DEPT_FINANCE',
    name: 'Phòng Kế toán & Tài chính',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-bod',
    leaderId: 'e8',
    leaderName: 'Ngô Thị Accounting',
    leaderTitle: 'Kế toán trưởng',
    leaderEmail: 'accounting@demo.com',
    leaderPhone: '0907 778 899',
    memberCount: 4,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Quản trị tài chính, thu chi học phí, xuất hóa đơn chứng từ và kế toán cơ sở.',
    positions: ['Kế toán trưởng', 'Kế toán Cơ sở'],
    members: [
      { id: 'e8', name: 'Ngô Thị Accounting', title: 'Kế toán trưởng', role: 'Quản lý', isPrimary: true, phone: '0907 778 899', email: 'accounting@demo.com', joinedDate: '2023-02-15' },
    ],
    createdAt: '2023-02-01',
    updatedAt: '2026-02-15',
  },
  {
    id: 'org-dept-it',
    code: 'DEPT_IT',
    name: 'Phòng IT & Kỹ thuật',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-bod',
    leaderId: 'e9',
    leaderName: 'Bùi Văn Support',
    leaderTitle: 'Trưởng nhóm IT & Kỹ thuật',
    leaderEmail: 'support@demo.com',
    leaderPhone: '0908 889 900',
    memberCount: 3,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Bảo trì hệ thống mạng, thiết bị phòng học tương tác và hỗ trợ kỹ thuật trung tâm.',
    positions: ['Trưởng nhóm IT & Kỹ thuật', 'Kỹ thuật viên IT & Thiết bị'],
    members: [
      { id: 'e9', name: 'Bùi Văn Support', title: 'Trưởng nhóm IT', role: 'Quản lý', isPrimary: true, phone: '0908 889 900', email: 'support@demo.com', joinedDate: '2023-11-01' },
    ],
    createdAt: '2023-05-01',
    updatedAt: '2026-02-15',
  },
  {
    id: 'org-dept-admin',
    code: 'DEPT_ADMIN',
    name: 'Phòng Hành chính & Lễ tân',
    type: 'department',
    typeLabel: 'Phòng ban',
    parentId: 'org-bod',
    leaderId: 'e7',
    leaderName: 'Vũ Văn Reception',
    leaderTitle: 'Trưởng phòng Hành chính',
    leaderEmail: 'reception@demo.com',
    leaderPhone: '0906 667 788',
    memberCount: 5,
    status: 'active',
    statusLabel: 'Đang hoạt động',
    description: 'Đón tiếp phụ huynh học viên sảnh trung tâm, quản trị cơ sở vật chất hành chính.',
    positions: ['Trưởng phòng Hành chính', 'Lễ tân & Hành chính'],
    members: [
      { id: 'e7', name: 'Vũ Văn Reception', title: 'Trưởng phòng Hành chính', role: 'Quản lý', isPrimary: true, phone: '0906 667 788', email: 'reception@demo.com', joinedDate: '2026-04-11' },
    ],
    createdAt: '2023-06-01',
    updatedAt: '2026-02-15',
  },
]

export interface OrgDepartmentOption {
  value: string
  label: string
  orgUnitId: string
  name: string
  code: string
}

export function getOrgDepartmentOptions(): OrgDepartmentOption[] {
  // Lọc các node cấp Điều hành, Khối hoặc Phòng ban để làm danh mục Khối/Phòng ban
  return mockOrgUnits
    .filter((u) => u.type === 'board' || u.type === 'block' || u.type === 'department')
    .map((u) => ({
      value: u.name,
      label: `${u.name} (${u.code})`,
      orgUnitId: u.id,
      name: u.name,
      code: u.code,
    }))
}

export function getOrgUnits(): OrgUnit[] {
  return mockOrgUnits
}

export function getOrgUnitById(id: string): OrgUnit | undefined {
  return mockOrgUnits.find((u) => u.id === id)
}

export interface OrgTreeNode extends OrgUnit {
  children: OrgTreeNode[]
}

export function getOrgTree(): OrgTreeNode[] {
  const map = new Map<string, OrgTreeNode>()

  mockOrgUnits.forEach((u) => {
    map.set(u.id, { ...u, children: [] })
  })

  const roots: OrgTreeNode[] = []

  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })

  return roots
}

export function createOrgUnit(data: Omit<OrgUnit, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'members'>): OrgUnit {
  const newUnit: OrgUnit = {
    ...data,
    id: `org-${data.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    memberCount: 0,
    positions: data.positions || [],
    members: [],
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  mockOrgUnits.push(newUnit)
  return newUnit
}

export function updateOrgUnit(id: string, updates: Partial<OrgUnit>): OrgUnit | null {
  const idx = mockOrgUnits.findIndex((u) => u.id === id)
  if (idx === -1) return null

  const updated = {
    ...mockOrgUnits[idx],
    ...updates,
    updatedAt: new Date().toISOString().slice(0, 10),
  }
  mockOrgUnits[idx] = updated
  return updated
}

export function transferStaff(params: {
  staffId: string
  fromUnitId: string
  toUnitId: string
  newTitle: string
  effectiveDate: string
  note?: string
}): boolean {
  const fromUnit = mockOrgUnits.find((u) => u.id === params.fromUnitId)
  const toUnit = mockOrgUnits.find((u) => u.id === params.toUnitId)
  if (!fromUnit || !toUnit) return false

  const staffIdx = fromUnit.members.findIndex((m) => m.id === params.staffId)
  if (staffIdx === -1) return false

  const [staff] = fromUnit.members.splice(staffIdx, 1)
  fromUnit.memberCount = fromUnit.members.length

  toUnit.members.push({
    ...staff,
    title: params.newTitle || staff.title,
    joinedDate: params.effectiveDate,
  })
  toUnit.memberCount = toUnit.members.length

  return true
}
