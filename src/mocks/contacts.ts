export interface RelatedContactInfo {
  name: string
  phone: string
  relationship: string // 'Mẹ' | 'Bố' | 'Con' | 'Người giám hộ'
}

export interface Contact {
  id: string
  name: string
  englishName?: string
  role: 'parent' | 'student'
  phone: string
  email?: string
  gender?: 'Male' | 'Female' | 'Other'
  dob?: string // YYYY-MM-DD
  address: string
  relatedContact?: RelatedContactInfo
  notes?: string
  branch?: string
  branches?: string[]
  interest?: string
  createdAt?: string
}

export const mockContacts: Contact[] = [
  // --- PHỤ HUYNH ---
  {
    id: '0912888203',
    name: 'Đỗ Thị Hương Thảo',
    role: 'parent',
    phone: '0912888203',
    email: 'thao.do@gmail.com',
    gender: 'Female',
    dob: '1988-11-12', // Hôm nay sinh nhật
    address: 'Tòa S2.05 Vinhome Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    branch: 'CS6 Vinsmart Tonkin',
    branches: ['CS6 Vinsmart Tonkin', 'RinoEdu Smart City'],
    relatedContact: {
      name: 'Nguyễn Ngọc Thảo Vy',
      phone: '0912999203',
      relationship: 'Con',
    },
    notes: 'Ưu tiên gọi điện ngoài giờ hành chính hoặc nhắn tin Zalo',
    createdAt: '2024-09-01T08:00:00Z',
  },
  {
    id: '0912345678',
    name: 'Nguyễn Thu Trang',
    role: 'parent',
    phone: '0912345678',
    email: 'thutrang.ng@gmail.com',
    gender: 'Female',
    dob: '1985-11-20', // Sinh nhật trong tháng 11
    address: 'Số 120 Hoàng Ngân, Trung Hòa, Cầu Giấy, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    branches: ['RinoEdu Nguyễn Tuân', 'RinoEdu Linh Đàm'],
    relatedContact: {
      name: 'Lê Nguyễn Bảo Hân',
      phone: '0987654321',
      relationship: 'Con',
    },
    notes: 'Mẹ của 2 bé Bảo Hân và Bảo Nam, trao đổi qua Zalo',
    createdAt: '2024-08-14T09:30:00Z',
  },
  {
    id: '0912987889',
    name: 'Đỗ Quang Hùng',
    role: 'parent',
    phone: '0912987889',
    email: 'hung.do@fpt.com',
    gender: 'Male',
    dob: '1982-08-15',
    address: 'Tòa Hapulico, 85 Vũ Trọng Phụng, Thanh Xuân, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    branches: ['RinoEdu Nguyễn Tuân'],
    relatedContact: {
      name: 'Đỗ Minh Quân',
      phone: '0919876543',
      relationship: 'Con',
    },
    notes: 'Bố hay đi công tác xa, gọi sau 19h00 các ngày trong tuần',
    createdAt: '2026-02-20T11:00:00Z',
  },
  {
    id: '0987112024',
    name: 'Vũ Văn Nam',
    role: 'parent',
    phone: '0987112024',
    email: 'nam.vu@vietcombank.com.vn',
    gender: 'Male',
    dob: '1986-03-25',
    address: 'Bán đảo Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội',
    branch: 'RinoEdu Linh Đàm',
    branches: ['RinoEdu Linh Đàm'],
    relatedContact: {
      name: 'Vũ Thảo Nhi',
      phone: '0982345678',
      relationship: 'Con',
    },
    notes: 'Liên hệ vào buổi chiều từ 14h - 17h',
    createdAt: '2026-07-25T14:00:00Z',
  },
  {
    id: '0901234512',
    name: 'Hoàng Văn Đức',
    role: 'parent',
    phone: '0901234512',
    email: 'duc.hoang@gmail.com',
    gender: 'Male',
    dob: '1980-12-05',
    address: 'Tòa GS1 Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    branch: 'RinoEdu Smart City',
    branches: ['RinoEdu Smart City'],
    relatedContact: {
      name: 'Nguyễn An',
      phone: '0911111111',
      relationship: 'Con',
    },
    notes: 'Bố phụ trách đưa đón cả 2 bé',
    createdAt: '2025-01-10T10:00:00Z',
  },
  {
    id: '0911222333',
    name: 'Trần Thị Lan',
    role: 'parent',
    phone: '0911222333',
    email: 'lan.tran@email.com',
    gender: 'Female',
    dob: '1990-07-18',
    address: 'Số 48 Ngụy Như Kon Tum, Nhân Chính, Thanh Xuân, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    branches: ['RinoEdu Nguyễn Tuân'],
    relatedContact: {
      name: 'Trần Minh Đức',
      phone: '0912333444',
      relationship: 'Con',
    },
    notes: 'Phụ huynh muốn nhận kết quả học tập qua email',
    createdAt: '2025-05-15T08:00:00Z',
  },

  // --- HỌC VIÊN (CON) ---
  {
    id: '0912999203',
    name: 'Nguyễn Ngọc Thảo Vy',
    englishName: 'Chloe',
    role: 'student',
    phone: '0912999203',
    email: 'thaovy.nguyen@email.com',
    gender: 'Female',
    dob: '2020-11-12', // Hôm nay sinh nhật
    address: 'Tòa S2.05 Vinhome Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    branch: 'CS6 Vinsmart Tonkin',
    branches: ['CS6 Vinsmart Tonkin', 'RinoEdu Smart City'],
    relatedContact: {
      name: 'Đỗ Thị Hương Thảo',
      phone: '0912888203',
      relationship: 'Mẹ',
    },
    notes: 'Bé tiếp thu tốt qua hình ảnh, thích hoạt động nhóm',
    createdAt: '2024-09-01T08:00:00Z',
  },
  {
    id: '0987654321',
    name: 'Lê Nguyễn Bảo Hân',
    englishName: 'Hannah',
    role: 'student',
    phone: '0987654321',
    email: 'baohan.le@email.com',
    gender: 'Female',
    dob: '2014-11-28', // Sinh nhật trong tháng 11
    address: 'Số 120 Hoàng Ngân, Trung Hòa, Cầu Giấy, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    branches: ['RinoEdu Nguyễn Tuân'],
    relatedContact: {
      name: 'Nguyễn Thu Trang',
      phone: '0912345678',
      relationship: 'Mẹ',
    },
    notes: 'Học lực xuất sắc, chuẩn bị thi toán tư duy',
    createdAt: '2024-08-14T09:30:00Z',
  },
  {
    id: '0918765432',
    name: 'Hoàng Bảo Nam',
    englishName: 'Leo',
    role: 'student',
    phone: '0918765432',
    email: 'baonam.hoang@email.com',
    gender: 'Male',
    dob: '2013-05-20',
    address: 'Số 120 Hoàng Ngân, Trung Hòa, Cầu Giấy, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    branches: ['RinoEdu Nguyễn Tuân'],
    relatedContact: {
      name: 'Nguyễn Thu Trang',
      phone: '0912345678',
      relationship: 'Mẹ',
    },
    notes: 'Anh trai của bé Bảo Hân',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '0919876543',
    name: 'Đỗ Minh Quân',
    englishName: 'Marcus',
    role: 'student',
    phone: '0919876543',
    email: 'minhquan.do@email.com',
    gender: 'Male',
    dob: '2012-11-10', // Sinh nhật trong tháng 11
    address: 'Tòa Hapulico, 85 Vũ Trọng Phụng, Thanh Xuân, Hà Nội',
    branch: 'RinoEdu Nguyễn Tuân',
    branches: ['RinoEdu Nguyễn Tuân'],
    relatedContact: {
      name: 'Đỗ Quang Hùng',
      phone: '0912987889',
      relationship: 'Bố',
    },
    notes: 'Cần luyện thêm kỹ năng phát âm và giao tiếp',
    createdAt: '2026-02-20T11:00:00Z',
  },
  {
    id: '0982345678',
    name: 'Vũ Thảo Nhi',
    englishName: 'Chloe',
    role: 'student',
    phone: '0982345678',
    email: 'thaonhi.vu@email.com',
    gender: 'Female',
    dob: '2015-08-22',
    address: 'Bán đảo Linh Đàm, Hoàng Liệt, Hoàng Mai, Hà Nội',
    branch: 'RinoEdu Linh Đàm',
    branches: ['RinoEdu Linh Đàm'],
    relatedContact: {
      name: 'Vũ Văn Nam',
      phone: '0987112024',
      relationship: 'Bố',
    },
    notes: 'Đăng ký học ca tối thứ 3 và thứ 6',
    createdAt: '2026-07-25T14:00:00Z',
  },
  {
    id: '0911111111',
    name: 'Nguyễn An',
    englishName: 'Alex',
    role: 'student',
    phone: '0911111111',
    email: 'an@email.com',
    gender: 'Male',
    dob: '2005-03-15',
    address: 'Tòa GS1 Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội',
    branch: 'RinoEdu Smart City',
    branches: ['RinoEdu Smart City'],
    relatedContact: {
      name: 'Hoàng Văn Đức',
      phone: '0901234512',
      relationship: 'Bố',
    },
    notes: 'Lớp IELTS Junior 1A',
    createdAt: '2025-01-10T10:00:00Z',
  },
]

export function getContacts(filters?: {
  search?: string
  branch?: string
  role?: string
  birthday?: 'all' | 'this_month' | 'today'
}): Contact[] {
  return mockContacts.filter((c) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matchName = c.name.toLowerCase().includes(q)
      const matchEnglish = c.englishName?.toLowerCase().includes(q)
      const matchPhone = c.phone.includes(filters.search)
      const matchEmail = c.email?.toLowerCase().includes(q)
      const matchAddress = c.address.toLowerCase().includes(q)
      const matchRel =
        c.relatedContact?.name.toLowerCase().includes(q) ||
        c.relatedContact?.phone.includes(filters.search)
      if (!matchName && !matchEnglish && !matchPhone && !matchEmail && !matchAddress && !matchRel) {
        return false
      }
    }
    if (filters?.branch && filters.branch !== 'all') {
      const inBranch = c.branch === filters.branch
      const inBranches = c.branches && c.branches.includes(filters.branch)
      if (!inBranch && !inBranches) return false
    }
    if (filters?.role && filters.role !== 'all' && c.role !== filters.role) {
      return false
    }
    return true
  })
}
