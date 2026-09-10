export interface BranchRoom {
  id: string
  name: string
  code: string
  roomType: 'standard' | 'lab' | 'vip' | 'multipurpose'
  roomTypeLabel: string
  capacity: number
  floor: string
  status: 'available' | 'in_use' | 'maintenance'
  equipment: string[]
}

export interface BranchHistoryItem {
  id: string
  timestamp: string
  actor: string
  action: string
  details: string
}

export interface BranchStaffMember {
  id: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  roleInBranch?: string
  contractType?: string
  avatar?: string
}

export interface Branch {
  id: string
  code: string
  name: string
  type: 'training_center' | 'headquarters' | 'testing_center'
  typeLabel: string
  region: string
  province: string
  district: string
  address: string
  phone: string
  email: string
  coordinates: string
  status: 'active' | 'setup' | 'inactive'
  statusLabel: string
  managerId: string
  managerName: string
  managerPhone: string
  managerEmail: string
  managerAvatar?: string
  roomCount: number
  totalCapacity: number
  activeClassesCount: number
  activeStudentsCount: number
  businessHours: {
    openTime: string
    closeTime: string
    daysOfWeek: string
  }
  rooms: BranchRoom[]
  assignedStaff?: BranchStaffMember[]
  history: BranchHistoryItem[]
  createdAt: string
  updatedAt: string
}

export const mockBranches: Branch[] = [
  {
    id: 'br-linh-dam',
    code: 'LD_HN',
    name: 'RinoEdu Linh Đàm',
    type: 'training_center',
    typeLabel: 'Trung tâm Đào tạo',
    region: 'Miền Bắc - Hà Nội',
    province: 'Hà Nội',
    district: 'Hoàng Mai',
    address: 'Tầng 3, TTTM Rice City, KĐT Nam Linh Đàm, Hoàng Mai, Hà Nội',
    phone: '024 7300 8866',
    email: 'linhdam@rinoedu.vn',
    coordinates: '20.9634, 105.8271',
    status: 'active',
    statusLabel: 'Đang hoạt động',
    managerId: 'emp-001',
    managerName: 'Nguyễn Văn An',
    managerPhone: '0988 123 456',
    managerEmail: 'an.nv@rinoedu.vn',
    managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    roomCount: 12,
    totalCapacity: 240,
    activeClassesCount: 18,
    activeStudentsCount: 215,
    businessHours: {
      openTime: '08:00',
      closeTime: '21:30',
      daysOfWeek: 'Thứ 2 - Chủ Nhật',
    },
    rooms: [
      { id: 'rm-ld-101', name: 'Phòng 101 - Smart English', code: 'LD-101', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 3', status: 'available', equipment: ['Smart TV 65"', 'Bảng từ', 'Điều hòa 2 chiều'] },
      { id: 'rm-ld-102', name: 'Phòng 102 - Junior Math', code: 'LD-102', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 18, floor: 'Tầng 3', status: 'in_use', equipment: ['Máy chiếu', 'Bảng tương tác', 'Điều hòa'] },
      { id: 'rm-ld-103', name: 'Phòng 103 - Digi Lab', code: 'LD-103', roomType: 'lab', roomTypeLabel: 'Phòng Lab Máy tính', capacity: 24, floor: 'Tầng 3', status: 'available', equipment: ['24 máy tính All-in-one', 'Tai nghe chống ồn', 'Server cục bộ'] },
      { id: 'rm-ld-104', name: 'Phòng 104 - VIP 1:1', code: 'LD-104', roomType: 'vip', roomTypeLabel: 'Phòng VIP / Test', capacity: 6, floor: 'Tầng 3', status: 'available', equipment: ['Bàn tròn thảo luận', 'Micro thu âm', 'Camera góc rộng'] },
      { id: 'rm-ld-105', name: 'Phòng 105 - Hội thảo', code: 'LD-105', roomType: 'multipurpose', roomTypeLabel: 'Phòng Đa năng', capacity: 40, floor: 'Tầng 3', status: 'maintenance', equipment: ['Hệ thống âm thanh biểu diễn', '2 Máy chiếu công suất lớn'] },
    ],
    history: [
      { id: 'h-1', timestamp: '2026-03-01 09:30', actor: 'Admin Hệ thống', action: 'Bảo trì phòng', details: 'Chuyển trạng thái Phòng 105 sang Bảo trì nâng cấp âm thanh' },
      { id: 'h-2', timestamp: '2026-01-15 14:00', actor: 'Nguyễn Văn An', action: 'Cập nhật giờ hoạt động', details: 'Kéo dài giờ đóng cửa từ 21:00 sang 21:30 phục vụ ca Digi' },
      { id: 'h-3', timestamp: '2025-08-10 08:00', actor: 'Admin Hệ thống', action: 'Khai trương cơ sở', details: 'Chuyển trạng thái cơ sở từ Setup sang Hoạt động' },
    ],
    createdAt: '2025-06-01',
    updatedAt: '2026-03-01',
  },
  {
    id: 'br-nguyen-tuan',
    code: 'NT_HN',
    name: 'RinoEdu Nguyễn Tuân',
    type: 'training_center',
    typeLabel: 'Trung tâm Đào tạo',
    region: 'Miền Bắc - Hà Nội',
    province: 'Hà Nội',
    district: 'Thanh Xuân',
    address: 'Số 90 Nguyễn Tuân, Phường Thanh Xuân Trung, Thanh Xuân, Hà Nội',
    phone: '024 7300 8877',
    email: 'nguyentuan@rinoedu.vn',
    coordinates: '20.9982, 105.8035',
    status: 'active',
    statusLabel: 'Đang hoạt động',
    managerId: 'emp-002',
    managerName: 'Trần Thị Bích',
    managerPhone: '0977 234 567',
    managerEmail: 'bich.tt@rinoedu.vn',
    managerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80',
    roomCount: 10,
    totalCapacity: 190,
    activeClassesCount: 14,
    activeStudentsCount: 168,
    businessHours: {
      openTime: '08:00',
      closeTime: '21:00',
      daysOfWeek: 'Thứ 2 - Thứ 7',
    },
    rooms: [
      { id: 'rm-nt-201', name: 'Phòng 201 - Cambridge A', code: 'NT-201', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 2', status: 'available', equipment: ['Smart TV 75"', 'Bảng trượt 2 lớp'] },
      { id: 'rm-nt-202', name: 'Phòng 202 - Cambridge B', code: 'NT-202', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 2', status: 'available', equipment: ['Smart TV 75"', 'Bảng trượt 2 lớp'] },
      { id: 'rm-nt-203', name: 'Phòng 203 - Lab Thực hành', code: 'NT-203', roomType: 'lab', roomTypeLabel: 'Phòng Lab Máy tính', capacity: 22, floor: 'Tầng 2', status: 'in_use', equipment: ['22 máy PC Core i5', 'Tai nghe học tiếng Anh'] },
      { id: 'rm-nt-204', name: 'Phòng 204 - Vấn đáp Test', code: 'NT-204', roomType: 'vip', roomTypeLabel: 'Phòng VIP / Test', capacity: 8, floor: 'Tầng 2', status: 'available', equipment: ['Micro để bàn', 'Camera giám sát khảo thí'] },
    ],
    history: [
      { id: 'h-4', timestamp: '2026-02-18 10:15', actor: 'Trần Thị Bích', action: 'Bổ sung thiết bị', details: 'Bàn giao 5 tai nghe mới cho phòng Lab 203' },
      { id: 'h-5', timestamp: '2025-09-01 08:00', actor: 'Admin Hệ thống', action: 'Đưa vào vận hành', details: 'Hoàn tất nghiệm thu cơ sở vật chất' },
    ],
    createdAt: '2025-07-15',
    updatedAt: '2026-02-18',
  },
  {
    id: 'br-smart-city',
    code: 'SC_HN',
    name: 'RinoEdu Smart City',
    type: 'training_center',
    typeLabel: 'Trung tâm Đào tạo',
    region: 'Miền Bắc - Hà Nội',
    province: 'Hà Nội',
    district: 'Nam Từ Liêm',
    address: 'Shophouse S2.05, Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    phone: '024 7300 8899',
    email: 'smartcity@rinoedu.vn',
    coordinates: '21.0029, 105.7431',
    status: 'active',
    statusLabel: 'Đang hoạt động',
    managerId: 'emp-003',
    managerName: 'Lê Hoàng Long',
    managerPhone: '0966 345 678',
    managerEmail: 'long.lh@rinoedu.vn',
    managerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    roomCount: 8,
    totalCapacity: 150,
    activeClassesCount: 11,
    activeStudentsCount: 135,
    businessHours: {
      openTime: '08:30',
      closeTime: '21:30',
      daysOfWeek: 'Thứ 2 - Chủ Nhật',
    },
    rooms: [
      { id: 'rm-sc-101', name: 'Phòng STEAM 1', code: 'SC-101', roomType: 'lab', roomTypeLabel: 'Phòng Lab Máy tính', capacity: 18, floor: 'Tầng 1', status: 'available', equipment: ['Bộ kit Robot STEAM', 'Smartboard 86"'] },
      { id: 'rm-sc-102', name: 'Phòng Phổ thông 2', code: 'SC-102', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 2', status: 'available', equipment: ['Smart TV', 'Bảng chống lóa'] },
      { id: 'rm-sc-103', name: 'Phòng Trải nghiệm Test', code: 'SC-103', roomType: 'vip', roomTypeLabel: 'Phòng VIP / Test', capacity: 10, floor: 'Tầng 2', status: 'available', equipment: ['Bộ câu hỏi đánh giá chuẩn hóa', 'iPad mini làm bài'] },
    ],
    history: [
      { id: 'h-6', timestamp: '2026-01-20 16:30', actor: 'Lê Hoàng Long', action: 'Kiểm định PCCC', details: 'Nghiệm thu hệ thống báo khói định kỳ 6 tháng' },
      { id: 'h-7', timestamp: '2025-11-01 08:30', actor: 'Admin Hệ thống', action: 'Khai trương điểm học', details: 'Đón học viên đợt 1' },
    ],
    createdAt: '2025-09-10',
    updatedAt: '2026-01-20',
  },
  {
    id: 'br-cau-giay',
    code: 'CG_HN',
    name: 'RinoEdu Cầu Giấy',
    type: 'training_center',
    typeLabel: 'Trung tâm Đào tạo',
    region: 'Miền Bắc - Hà Nội',
    province: 'Hà Nội',
    district: 'Cầu Giấy',
    address: 'Tầng 4, Tòa nhà Discovery Complex, 302 Cầu Giấy, Cầu Giấy, Hà Nội',
    phone: '024 7300 8822',
    email: 'caugiay@rinoedu.vn',
    coordinates: '21.0345, 105.7958',
    status: 'setup',
    statusLabel: 'Mới thiết lập',
    managerId: 'emp-004',
    managerName: 'Phạm Minh Đức',
    managerPhone: '0912 456 789',
    managerEmail: 'duc.pm@rinoedu.vn',
    roomCount: 6,
    totalCapacity: 120,
    activeClassesCount: 0,
    activeStudentsCount: 0,
    businessHours: {
      openTime: '08:00',
      closeTime: '21:00',
      daysOfWeek: 'Thứ 2 - Thứ 7',
    },
    rooms: [
      { id: 'rm-cg-101', name: 'Phòng 101 - Khảo sát', code: 'CG-101', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 4', status: 'available', equipment: ['Đang lắp đặt bàn ghế'] },
      { id: 'rm-cg-102', name: 'Phòng 102 - Khảo sát', code: 'CG-102', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 4', status: 'available', equipment: ['Đang thi công sơn tường'] },
    ],
    history: [
      { id: 'h-8', timestamp: '2026-02-25 11:00', actor: 'Admin Hệ thống', action: 'Khởi tạo cơ sở', details: 'Khai báo chi nhánh mới ở trạng thái Setup' },
    ],
    createdAt: '2026-02-25',
    updatedAt: '2026-02-25',
  },
  {
    id: 'br-ha-dong',
    code: 'HD_HN',
    name: 'RinoEdu Hà Đông',
    type: 'training_center',
    typeLabel: 'Trung tâm Đào tạo',
    region: 'Miền Bắc - Hà Nội',
    province: 'Hà Nội',
    district: 'Hà Đông',
    address: 'Số 45 Quang Trung, Phường Quang Trung, Hà Đông, Hà Nội',
    phone: '024 7300 8833',
    email: 'hadong@rinoedu.vn',
    coordinates: '20.9712, 105.7745',
    status: 'inactive',
    statusLabel: 'Tạm dừng',
    managerId: 'emp-005',
    managerName: 'Vũ Thị Hạnh',
    managerPhone: '0904 567 890',
    managerEmail: 'hanh.vt@rinoedu.vn',
    roomCount: 5,
    totalCapacity: 95,
    activeClassesCount: 0,
    activeStudentsCount: 0,
    businessHours: {
      openTime: '08:00',
      closeTime: '21:00',
      daysOfWeek: 'Thứ 2 - Thứ 7',
    },
    rooms: [
      { id: 'rm-hd-101', name: 'Phòng 101', code: 'HD-101', roomType: 'standard', roomTypeLabel: 'Phòng tiêu chuẩn', capacity: 20, floor: 'Tầng 1', status: 'maintenance', equipment: ['Đang sửa chữa sàn nhà'] },
    ],
    history: [
      { id: 'h-9', timestamp: '2026-01-10 14:20', actor: 'Admin Hệ thống', action: 'Khóa cơ sở', details: 'Tạm dừng hoạt động để đại tu mặt bằng trụ sở' },
    ],
    createdAt: '2024-10-15',
    updatedAt: '2026-01-10',
  },
]

export function getBranchesList(filters?: {
  search?: string
  status?: string
  region?: string
  type?: string
}): Branch[] {
  let result = [...mockBranches]

  if (filters?.search) {
    const q = filters.search.toLowerCase().trim()
    result = result.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.code.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.phone.includes(q) ||
        b.managerName.toLowerCase().includes(q)
    )
  }

  if (filters?.status && filters.status !== 'all') {
    result = result.filter((b) => b.status === filters.status)
  }

  if (filters?.region && filters.region !== 'all') {
    result = result.filter((b) => b.region === filters.region)
  }

  if (filters?.type && filters.type !== 'all') {
    result = result.filter((b) => b.type === filters.type)
  }

  return result
}

export function getBranchById(id: string): Branch | undefined {
  return mockBranches.find((b) => b.id === id)
}

export function createBranch(newBranch: Omit<Branch, 'id' | 'createdAt' | 'updatedAt' | 'history'>): Branch {
  const branch: Branch = {
    ...newBranch,
    id: `br-${newBranch.code.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
    createdAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        actor: 'Admin Hệ thống',
        action: 'Tạo mới cơ sở',
        details: 'Khởi tạo hồ sơ cơ sở mới trên hệ thống',
      },
    ],
  }
  mockBranches.unshift(branch)
  return branch
}

export function updateBranch(id: string, updates: Partial<Branch>): Branch | null {
  const idx = mockBranches.findIndex((b) => b.id === id)
  if (idx === -1) return null

  const existing = mockBranches[idx]
  const updated: Branch = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString().slice(0, 10),
    history: [
      {
        id: `h-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        actor: 'Admin Hệ thống',
        action: 'Cập nhật thông tin',
        details: 'Cập nhật thuộc tính hồ sơ chi nhánh',
      },
      ...existing.history,
    ],
  }
  mockBranches[idx] = updated
  return updated
}

export function toggleBranchStatus(id: string, nextStatus: 'active' | 'inactive' | 'setup'): Branch | null {
  const branch = getBranchById(id)
  if (!branch) return null

  const labelMap = {
    active: 'Đang hoạt động',
    setup: 'Mới thiết lập',
    inactive: 'Tạm dừng',
  }

  return updateBranch(id, {
    status: nextStatus,
    statusLabel: labelMap[nextStatus],
  })
}
