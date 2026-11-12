export interface BankInfo {
  bankName: string
  accountNumber: string
  accountHolder: string
}

export interface Supplier {
  id: string
  type: 'organization' | 'individual'
  name: string // Tên đối tượng cung cấp
  category:
    | 'Sách & Giáo trình'
    | 'Thiết bị & Công nghệ'
    | 'Đồng phục & Quà tặng'
    | 'Ấn phẩm & In ấn'
    | 'Phần mềm & Học liệu số'
    | 'Văn phòng phẩm & Cơ sở vật chất'
    | 'Đào tạo & Khảo thí'
    | 'Bảo trì & Cơ điện'

  // Người liên hệ (Luôn là cá nhân)
  contactPersonName: string
  contactPersonRole: string // Chức danh / Vai trò
  contactPhone: string
  contactEmail?: string

  // Thông tin tổ chức (Nếu type === 'organization')
  orgName?: string
  taxCode?: string
  orgAddress?: string
  website?: string

  address: string
  bankInfo?: BankInfo
  rating?: number // 1 - 5 sao
  status: 'active' | 'inactive'
  notes?: string
  createdAt: string
}

export const mockSuppliers: Supplier[] = [
  // --- TỔ CHỨC / DOANH NGHIỆP ---
  {
    id: 'sup-01',
    type: 'organization',
    name: 'Công ty CP Sách & Học liệu Cambridge Việt Nam',
    orgName: 'Công ty Cổ phần Sách & Học liệu Cambridge Việt Nam',
    taxCode: '0108998822',
    category: 'Sách & Giáo trình',
    contactPersonName: 'Nguyễn Văn Tuấn',
    contactPersonRole: 'Giám đốc phân phối miền Bắc',
    contactPhone: '0918882233',
    contactEmail: 'tuan.nguyen@cambridgebooks.vn',
    orgAddress: 'Tầng 5, Tòa nhà Thăng Long, 98 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội',
    address: '98 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội',
    website: 'https://cambridgebooks.vn',
    bankInfo: {
      bankName: 'Vietcombank - CN Thanh Xuân',
      accountNumber: '0011004455667',
      accountHolder: 'CTY CP SACH CAMBRIDGE VN',
    },
    rating: 4.9,
    status: 'active',
    notes: 'Cung cấp toàn bộ giáo trình Cambridge Primary, IELTS và Flyers. Chiết khấu 25% cho đơn hàng > 50 bộ.',
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'sup-02',
    type: 'organization',
    name: 'Công ty TNHH Thiết bị & Smart Classroom Tân Phát',
    orgName: 'Công ty TNHH Thiết bị Giáo dục Tân Phát',
    taxCode: '0107776655',
    category: 'Thiết bị & Công nghệ',
    contactPersonName: 'Lê Thị Hồng Hạnh',
    contactPersonRole: 'Trưởng phòng Dự án Giáo dục',
    contactPhone: '0903335566',
    contactEmail: 'hanh.le@tanphatedu.com',
    orgAddress: 'Số 42 ngõ 178 Thái Hà, Đống Đa, Hà Nội',
    address: 'Số 42 ngõ 178 Thái Hà, Đống Đa, Hà Nội',
    website: 'https://tanphatedu.com',
    bankInfo: {
      bankName: 'Techcombank - CN Đống Đa',
      accountNumber: '1903322114455',
      accountHolder: 'CONG TY TNHH THIET BI TAN PHAT',
    },
    rating: 4.8,
    status: 'active',
    notes: 'Bảo hành Smart TV, màn hình cảm ứng tương tác 24 tháng tận nơi.',
    createdAt: '2024-03-20T10:00:00Z',
  },
  {
    id: 'sup-03',
    type: 'organization',
    name: 'Xưởng may Đồng phục & Balo Học viên Everest',
    orgName: 'Công ty TNHH May Mặc & Quà tặng Everest',
    taxCode: '0109993311',
    category: 'Đồng phục & Quà tặng',
    contactPersonName: 'Đỗ Minh Khang',
    contactPersonRole: 'Quản lý xưởng & đơn hàng lớn',
    contactPhone: '0988776611',
    contactEmail: 'khang.do@everestuniform.vn',
    orgAddress: 'Lô C3 Cụm công nghiệp Triều Khúc, Tân Triều, Thanh Trì, Hà Nội',
    address: 'Cụm CN Triều Khúc, Thanh Trì, Hà Nội',
    bankInfo: {
      bankName: 'MB Bank - CN Hà Đông',
      accountNumber: '068899772211',
      accountHolder: 'CTY MAY MAC EVEREST',
    },
    rating: 4.7,
    status: 'active',
    notes: 'May áo đồng phục hè/thu, balo chống gù, bình nước in logo trung tâm.',
    createdAt: '2024-06-10T09:00:00Z',
  },
  {
    id: 'sup-04',
    type: 'organization',
    name: 'Nhà in & Thiết kế Mỹ thuật Alpha Print',
    orgName: 'Công ty CP In & Truyền thông Alpha',
    taxCode: '0106665544',
    category: 'Ấn phẩm & In ấn',
    contactPersonName: 'Hoàng Thị Mai',
    contactPersonRole: 'Phụ trách Tài khoản Doanh nghiệp',
    contactPhone: '0912554433',
    contactEmail: 'mai.hoang@alphaprint.vn',
    orgAddress: 'Số 15 ngõ 68 Triều Khúc, Thanh Xuân, Hà Nội',
    address: 'Thanh Xuân, Hà Nội',
    rating: 4.6,
    status: 'active',
    notes: 'In chứng chỉ tốt nghiệp, flyer tuyển sinh, sổ tay học viên, backdrop sự kiện.',
    createdAt: '2024-08-01T14:00:00Z',
  },
  {
    id: 'sup-05',
    type: 'organization',
    name: 'Công ty TNHH Giải pháp Phần mềm EdTech Rino',
    orgName: 'Công ty TNHH Giải pháp Giáo dục Số Rino EdTech',
    taxCode: '0105554422',
    category: 'Phần mềm & Học liệu số',
    contactPersonName: 'Vũ Đức Thắng',
    contactPersonRole: 'Giám đốc Kỹ thuật & Tích hợp',
    contactPhone: '0936668899',
    contactEmail: 'thang.vu@rinoedtech.io',
    orgAddress: 'Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội',
    address: 'Cầu Giấy, Hà Nội',
    website: 'https://rinoedtech.io',
    rating: 5.0,
    status: 'active',
    notes: 'Cung cấp nền tảng số hóa đề thi, hệ thống bài tập về nhà online và cổng kết nối Zalo OA.',
    createdAt: '2023-11-15T09:00:00Z',
  },
  {
    id: 'sup-06',
    type: 'organization',
    name: 'Nhà cung cấp Nước uống & Văn phòng phẩm Hòa Phát',
    orgName: 'Công ty TNHH Thương mại Dịch vụ Tổng hợp Hòa Phát',
    taxCode: '0104443311',
    category: 'Văn phòng phẩm & Cơ sở vật chất',
    contactPersonName: 'Bùi Văn Long',
    contactPersonRole: 'Điều phối viên Hậu cần',
    contactPhone: '0977112233',
    contactEmail: 'long.bui@hoaphatstationery.vn',
    orgAddress: 'Số 88 Khương Đình, Thanh Xuân, Hà Nội',
    address: 'Thanh Xuân, Hà Nội',
    rating: 4.5,
    status: 'active',
    notes: 'Giao bình nước Lavie 19L, giấy A4, bút viết bảng hàng tuần cho tất cả các chi nhánh.',
    createdAt: '2024-02-01T08:00:00Z',
  },

  // --- CÁ NHÂN CUNG CẤP ---
  {
    id: 'sup-07',
    type: 'individual',
    name: 'Thầy Robert Johnson',
    category: 'Đào tạo & Khảo thí',
    contactPersonName: 'Robert Johnson',
    contactPersonRole: 'Chuyên gia khảo thí & Tập huấn giáo viên quốc tế',
    contactPhone: '0904448822',
    contactEmail: 'robert.johnson.trainer@gmail.com',
    address: 'Khu căn hộ D’Capitale, Trần Duy Hưng, Cầu Giấy, Hà Nội',
    bankInfo: {
      bankName: 'HSBC Việt Nam',
      accountNumber: '201098877665',
      accountHolder: 'ROBERT JOHNSON',
    },
    rating: 5.0,
    status: 'active',
    notes: 'Cung cấp dịch vụ tập huấn kỹ năng sư phạm cho giáo viên bản ngữ và chấm thi mock test IELTS.',
    createdAt: '2024-05-12T11:00:00Z',
  },
  {
    id: 'sup-08',
    type: 'individual',
    name: 'Kỹ sư Trần Hữu Kiên',
    category: 'Bảo trì & Cơ điện',
    contactPersonName: 'Trần Hữu Kiên',
    contactPersonRole: 'Kỹ sư trưởng bảo trì điện lạnh & cơ sở',
    contactPhone: '0915667788',
    contactEmail: 'kien.dienlanh.hn@gmail.com',
    address: 'Phường Hạ Đình, Thanh Xuân, Hà Nội',
    bankInfo: {
      bankName: 'VietinBank',
      accountNumber: '108003445566',
      accountHolder: 'TRAN HUU KIEN',
    },
    rating: 4.8,
    status: 'active',
    notes: 'Bảo dưỡng định kỳ điều hòa, hệ thống lọc không khí và đường điện âm tường cho các cơ sở.',
    createdAt: '2024-04-18T16:00:00Z',
  },
  {
    id: 'sup-09',
    type: 'individual',
    name: 'Cô Đặng Thùy Dương',
    category: 'Đào tạo & Khảo thí',
    contactPersonName: 'Đặng Thùy Dương',
    contactPersonRole: 'Biên dịch viên & Chấm thi chuyên sâu',
    contactPhone: '0982223344',
    contactEmail: 'thuyduong.ielts9@gmail.com',
    address: 'Phường Mễ Trì, Nam Từ Liêm, Hà Nội',
    rating: 4.9,
    status: 'active',
    notes: 'Biên soạn đề thi thử độc quyền và hiệu đính tài liệu học tập nâng cao.',
    createdAt: '2024-09-05T10:00:00Z',
  },
  {
    id: 'sup-10',
    type: 'individual',
    name: 'Họa sĩ Lê Thanh Tùng',
    category: 'Văn phòng phẩm & Cơ sở vật chất',
    contactPersonName: 'Lê Thanh Tùng',
    contactPersonRole: 'Nghệ sĩ thiết kế & Vẽ tranh trang trí',
    contactPhone: '0908889922',
    contactEmail: 'tung.art.decor@gmail.com',
    address: 'Quận Ba Đình, Hà Nội',
    rating: 4.7,
    status: 'active',
    notes: 'Vẽ tranh tường các góc sáng tạo, thiết kế tiểu cảnh chụp ảnh các mùa lễ hội (Halloween, Giáng sinh, Tết).',
    createdAt: '2024-10-01T09:30:00Z',
  },
]

export function getSuppliers(filters?: {
  search?: string
  type?: string
  category?: string
  status?: string
}): Supplier[] {
  return mockSuppliers.filter((s) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matchName = s.name.toLowerCase().includes(q)
      const matchContact = s.contactPersonName.toLowerCase().includes(q)
      const matchPhone = s.contactPhone.includes(filters.search)
      const matchTax = s.taxCode?.includes(filters.search)
      const matchOrg = s.orgName?.toLowerCase().includes(q)
      if (!matchName && !matchContact && !matchPhone && !matchTax && !matchOrg) {
        return false
      }
    }
    if (filters?.type && filters.type !== 'all' && s.type !== filters.type) {
      return false
    }
    if (filters?.category && filters.category !== 'all' && s.category !== filters.category) {
      return false
    }
    if (filters?.status && filters.status !== 'all' && s.status !== filters.status) {
      return false
    }
    return true
  })
}
