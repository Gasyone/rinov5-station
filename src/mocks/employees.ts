export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  gender?: 'Male' | 'Female' | 'Other'
  dob?: string
  department: string
  position: string
  secondaryPosition?: string
  branch: string
  branches?: string[]
  status: 'active' | 'probation' | 'resigned' | 'on_leave'
  salary: number
  hireDate: string
  contractType: 'Full-time' | 'Part-time' | 'Probation' | 'Intern'
  avatar?: string
  address: string
  emergencyContact?: string
}

export const mockEmployees: Employee[] = [
  // --- RinoEdu Smart City ---
  { id: "e1", name: "Nguyễn Văn Quản Lý", email: "manager.sc@demo.com", phone: "0909876543", gender: "Male", dob: "1990-05-15", department: "Ban Giám đốc", position: "Giám đốc cơ sở", branch: "RinoEdu Smart City", branches: ["RinoEdu Smart City", "RinoEdu Linh Đàm"], status: "active", salary: 25000000, hireDate: "2023-01-15", contractType: "Full-time", address: "Tòa GS2 Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội" },
  { id: "e4", name: "Hoàng Thị Giáo Viên", email: "teacher2@demo.com", phone: "0904445566", gender: "Female", dob: "1992-03-25", department: "Phòng Đào tạo", position: "Giáo viên Tiếng Anh", secondaryPosition: "Tổ phó chuyên môn", branch: "RinoEdu Smart City", branches: ["RinoEdu Smart City", "RinoEdu Nguyễn Tuân"], status: "active", salary: 18000000, hireDate: "2023-06-15", contractType: "Full-time", address: "Tòa S1.02 Vinhomes Smart City, Tây Mỗ, Nam Từ Liêm, Hà Nội" },
  { id: "e5", name: "Lê Thị Chăm Sóc", email: "csm1@demo.com", phone: "0902223344", gender: "Female", dob: "1997-07-30", department: "Customer Care", position: "CSM Specialist", branch: "RinoEdu Smart City", status: "active", salary: 14000000, hireDate: "2024-01-10", contractType: "Full-time", address: "Số 88 Lê Quang Đạo, Phú Đô, Nam Từ Liêm, Hà Nội" },
  { id: "t6", name: "Coenrad Redman", email: "coenrad@demo.com", phone: "0903338811", gender: "Male", dob: "1989-11-20", department: "Teaching", position: "Native Teacher", branch: "RinoEdu Smart City", status: "active", salary: 30000000, hireDate: "2023-08-01", contractType: "Full-time", address: "The Manor, Mễ Trì, Nam Từ Liêm, Hà Nội" },
  { id: "tg_sc1", name: "Nguyễn Thu Hà", email: "ha.sc@demo.com", phone: "0901234567", gender: "Female", dob: "2001-04-12", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Smart City", status: "active", salary: 8000000, hireDate: "2024-02-01", contractType: "Part-time", address: "Ký túc xá ĐH Quốc Gia, Cầu Giấy, Hà Nội" },
  { id: "tg_sc2", name: "Trần Minh Châu", email: "chau.sc@demo.com", phone: "0902345678", gender: "Female", dob: "2002-08-19", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Smart City", status: "active", salary: 8000000, hireDate: "2024-03-15", contractType: "Part-time", address: "Số 15 ngõ 20 Hồ Tùng Mậu, Mai Dịch, Cầu Giấy, Hà Nội" },
  { id: "e9", name: "Bùi Văn Support", email: "support@demo.com", phone: "0908889900", gender: "Male", dob: "1998-01-30", department: "IT", position: "IT Support", branch: "RinoEdu Smart City", status: "active", salary: 17000000, hireDate: "2023-11-01", contractType: "Full-time", address: "Số 32 Đại Mỗ, Nam Từ Liêm, Hà Nội" },
  { id: "sc1", name: "Trần Bảo Ngọc", email: "ngoc.sc@demo.com", phone: "0903456789", gender: "Female", dob: "1994-06-18", department: "Teaching", position: "IELTS Teacher", branch: "RinoEdu Smart City", status: "active", salary: 19000000, hireDate: "2023-09-01", contractType: "Full-time", address: "Tòa I1 Imperia Smart City, Nam Từ Liêm, Hà Nội" },
  { id: "sc2", name: "Vũ Đình Trọng", email: "trong.sc@demo.com", phone: "0904567890", gender: "Male", dob: "1993-12-05", department: "Teaching", position: "TOEIC Teacher", branch: "RinoEdu Smart City", status: "active", salary: 18500000, hireDate: "2023-10-10", contractType: "Full-time", address: "Số 56 Châu Văn Liêm, Nam Từ Liêm, Hà Nội" },
  { id: "sc3", name: "Phạm Mai Anh", email: "maianh.sc@demo.com", phone: "0905678901", gender: "Female", dob: "1998-03-22", department: "Customer Care", position: "CS Specialist", branch: "RinoEdu Smart City", status: "active", salary: 13500000, hireDate: "2024-04-01", contractType: "Full-time", address: "Số 12 ngõ 180 Tây Mỗ, Nam Từ Liêm, Hà Nội" },
  { id: "sc4", name: "Đinh Quốc Tuấn", email: "tuan.sc@demo.com", phone: "0906789012", gender: "Male", dob: "1996-09-14", department: "Customer Care", position: "CS Specialist", branch: "RinoEdu Smart City", status: "active", salary: 14000000, hireDate: "2024-01-15", contractType: "Full-time", address: "Số 9 An Khánh, Hoài Đức, Hà Nội" },
  { id: "sc5", name: "Lê Thu Trang", email: "trang.sc@demo.com", phone: "0907890123", gender: "Female", dob: "1995-10-30", department: "Teaching", position: "Kids English Teacher", branch: "RinoEdu Smart City", status: "active", salary: 17500000, hireDate: "2023-11-20", contractType: "Full-time", address: "Tòa S4.01 Vinhomes Smart City, Nam Từ Liêm, Hà Nội" },
  { id: "sc6", name: "Nguyễn Hải Đăng", email: "dang.sc@demo.com", phone: "0908901234", gender: "Male", dob: "1992-07-25", department: "Teaching", position: "Grammar Teacher", branch: "RinoEdu Smart City", status: "active", salary: 18000000, hireDate: "2023-05-10", contractType: "Full-time", address: "Số 104 Cầu Diễn, Bắc Từ Liêm, Hà Nội" },
  { id: "sc7", name: "Đặng Thị Lan Anh", email: "lananh.sc@demo.com", phone: "0909112233", gender: "Female", dob: "1996-05-12", department: "Teaching", position: "Giáo viên Tiếng Anh", branch: "RinoEdu Smart City", status: "active", salary: 18000000, hireDate: "2024-05-01", contractType: "Full-time", address: "Số 25 Doãn Kế Thiện, Cầu Giấy, Hà Nội" },

  // --- RinoEdu Nguyễn Tuân ---
  { id: "e2", name: "Trần Thị Sale", email: "sale1@demo.com", phone: "0901112233", gender: "Female", dob: "1995-08-20", department: "Phòng Tuyển sinh", position: "Sales Executive", secondaryPosition: "Phụ trách Online", branch: "RinoEdu Nguyễn Tuân", branches: ["RinoEdu Nguyễn Tuân", "RinoEdu Smart City"], status: "active", salary: 15000000, hireDate: "2024-03-01", contractType: "Full-time", address: "456 Đường Láng, Đống Đa, Hà Nội" },
  { id: "e3", name: "Phạm Văn Giảng Dạy", email: "teacher1@demo.com", phone: "0903334455", gender: "Male", dob: "1988-12-10", department: "Teaching", position: "IELTS Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 20000000, hireDate: "2022-09-01", contractType: "Full-time", address: "789 Lê Văn Lương, Thanh Xuân, Hà Nội" },
  { id: "e6", name: "Đặng Văn Bắc", email: "manager.hn@demo.com", phone: "0905556677", gender: "Male", dob: "1985-11-08", department: "Management", position: "Branch Manager", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 26000000, hireDate: "2022-06-01", contractType: "Full-time", address: "159 Nguyễn Trãi, Thanh Xuân, Hà Nội" },
  { id: "e8", name: "Ngô Thị Accounting", email: "accounting@demo.com", phone: "0907778899", gender: "Female", dob: "1993-09-22", department: "Finance", position: "Accountant", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 16000000, hireDate: "2023-02-15", contractType: "Full-time", address: "Số 82 Quan Nhân, Nhân Chính, Thanh Xuân, Hà Nội" },
  { id: "t1", name: "Sarah J.", email: "sarah@demo.com", phone: "0901223344", gender: "Female", dob: "1991-02-14", department: "Teaching", position: "Native Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 32000000, hireDate: "2022-10-01", contractType: "Full-time", address: "Tòa Golden West, Số 2 Lê Văn Thiêm, Thanh Xuân, Hà Nội" },
  { id: "t2", name: "Robert L.", email: "robert@demo.com", phone: "0902334455", gender: "Male", dob: "1987-05-20", department: "Teaching", position: "Native Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 31000000, hireDate: "2022-11-15", contractType: "Full-time", address: "Hapulico Complex, 1 Nguyễn Huy Tưởng, Thanh Xuân, Hà Nội" },
  { id: "t3", name: "Emily W.", email: "emily@demo.com", phone: "0903445566", gender: "Female", dob: "1993-09-08", department: "Teaching", position: "Native Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 29000000, hireDate: "2023-04-01", contractType: "Full-time", address: "Mandarin Garden, Hoàng Minh Giám, Cầu Giấy, Hà Nội" },
  { id: "tg_nt1", name: "Lê Hồng Nhung", email: "nhung.nt@demo.com", phone: "0904556677", gender: "Female", dob: "2001-11-25", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 8500000, hireDate: "2024-01-05", contractType: "Part-time", address: "Số 68 Triều Khúc, Thanh Xuân, Hà Nội" },
  { id: "tg_nt2", name: "Phạm Thùy Linh", email: "linh.nt@demo.com", phone: "0905667788", gender: "Female", dob: "2002-01-18", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 8500000, hireDate: "2024-02-20", contractType: "Part-time", address: "Số 114 Chính Kinh, Thanh Xuân, Hà Nội" },
  { id: "nt1", name: "Nguyễn Đức Minh", email: "minh.nt@demo.com", phone: "0906778899", gender: "Male", dob: "1994-08-12", department: "Teaching", position: "IELTS Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 19500000, hireDate: "2023-07-01", contractType: "Full-time", address: "Số 35 Nguyễn Tuân, Thanh Xuân, Hà Nội" },
  { id: "nt2", name: "Hoàng Thùy Linh", email: "linhh.nt@demo.com", phone: "0907889900", gender: "Female", dob: "1996-03-04", department: "Teaching", position: "Communication Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 17500000, hireDate: "2023-12-01", contractType: "Full-time", address: "Số 90 Hoàng Ngân, Cầu Giấy, Hà Nội" },
  { id: "nt3", name: "Bùi Thu Phương", email: "phuong.nt@demo.com", phone: "0908990011", gender: "Female", dob: "1997-12-28", department: "Customer Care", position: "CS Specialist", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 14000000, hireDate: "2024-03-10", contractType: "Full-time", address: "Số 18 Ngụy Như Kon Tum, Thanh Xuân, Hà Nội" },
  { id: "nt4", name: "Đỗ Anh Tuấn", email: "tuan.nt@demo.com", phone: "0909001122", gender: "Male", dob: "1995-05-16", department: "Teaching", position: "Grammar Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 18000000, hireDate: "2023-10-01", contractType: "Full-time", address: "Số 42 Khương Đình, Thanh Xuân, Hà Nội" },

  // --- RinoEdu Linh Đàm ---
  { id: "e7", name: "Vũ Văn Reception", email: "reception@demo.com", phone: "0906667788", gender: "Male", dob: "2000-04-15", department: "Admin", position: "Receptionist", branch: "RinoEdu Linh Đàm", status: "probation", salary: 8000000, hireDate: "2026-04-11", contractType: "Full-time", address: "Tòa HH2A Linh Đàm, Hoàng Mai, Hà Nội" },
  { id: "e10", name: "Đỗ Thị Part-time", email: "parttime@demo.com", phone: "0909990011", gender: "Female", dob: "2002-06-10", department: "Teaching", position: "Part-time Tutor", branch: "RinoEdu Linh Đàm", status: "active", salary: 5000000, hireDate: "2025-01-15", contractType: "Part-time", address: "Khu đô thị Đại Kim, Định Công, Hoàng Mai, Hà Nội" },
  { id: "e11", name: "Hồ Văn Đã Nghỉ", email: "resigned@demo.com", phone: "0910102020", gender: "Male", dob: "1991-04-05", department: "Sales", position: "Sales Executive", branch: "RinoEdu Linh Đàm", status: "resigned", salary: 0, hireDate: "2023-06-01", contractType: "Full-time", address: "Số 50 Giải Phóng, Phương Mai, Đống Đa, Hà Nội" },
  { id: "e12", name: "Nguyễn Hoàng Sale", email: "sale2@demo.com", phone: "0901112244", gender: "Male", dob: "1996-10-12", department: "Sales", position: "Sales Executive", branch: "RinoEdu Linh Đàm", status: "active", salary: 14500000, hireDate: "2024-05-15", contractType: "Full-time", address: "12 Láng Hạ, Ba Đình, Hà Nội" },
  { id: "t4", name: "Thu Hà", email: "ha.ld@demo.com", phone: "0902112233", gender: "Female", dob: "1992-01-10", department: "Teaching", position: "English Teacher", branch: "RinoEdu Linh Đàm", status: "active", salary: 18500000, hireDate: "2023-03-01", contractType: "Full-time", address: "Biệt thự BT4 Bán đảo Linh Đàm, Hoàng Mai, Hà Nội" },
  { id: "t5", name: "Mỹ Linh", email: "linh.ld@demo.com", phone: "0903223344", gender: "Female", dob: "1994-07-22", department: "Teaching", position: "English Teacher", branch: "RinoEdu Linh Đàm", status: "active", salary: 18000000, hireDate: "2023-05-15", contractType: "Full-time", address: "Tòa VP3 Bán đảo Linh Đàm, Hoàng Mai, Hà Nội" },
  { id: "tg_ld1", name: "Nguyễn Thu Hà", email: "th.ld@demo.com", phone: "0904334455", gender: "Female", dob: "2001-09-03", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Linh Đàm", status: "active", salary: 8000000, hireDate: "2024-02-10", contractType: "Part-time", address: "Số 18 Định Công Thượng, Hoàng Mai, Hà Nội" },
  { id: "tg_ld2", name: "Trần Minh Châu", email: "mc.ld@demo.com", phone: "0905445566", gender: "Female", dob: "2002-12-14", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Linh Đàm", status: "active", salary: 8000000, hireDate: "2024-03-01", contractType: "Part-time", address: "Số 75 Kim Giang, Thanh Xuân, Hà Nội" },
  { id: "tg_ld3", name: "Vũ Mai Hương", email: "mh.ld@demo.com", phone: "0906556677", gender: "Female", dob: "2000-06-30", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Linh Đàm", status: "active", salary: 8500000, hireDate: "2023-11-01", contractType: "Part-time", address: "Tòa HUD3 Nguyễn Đức Cảnh, Hoàng Mai, Hà Nội" },
  { id: "ld1", name: "Nguyễn Minh Đức", email: "duc.ld@demo.com", phone: "0907667788", gender: "Male", dob: "1993-04-18", department: "Teaching", position: "IELTS Teacher", branch: "RinoEdu Linh Đàm", status: "active", salary: 19000000, hireDate: "2023-08-20", contractType: "Full-time", address: "Số 12 ngõ 250 Kim Giang, Hoàng Mai, Hà Nội" },
  { id: "ld2", name: "Lê Phương Thảo", email: "thao.ld@demo.com", phone: "0908778899", gender: "Female", dob: "1996-11-09", department: "Teaching", position: "Communication Teacher", branch: "RinoEdu Linh Đàm", status: "active", salary: 17500000, hireDate: "2024-01-08", contractType: "Full-time", address: "Tòa Rice City Linh Đàm, Hoàng Mai, Hà Nội" },
  { id: "ld3", name: "Trần Quang Huy", email: "huy.ld@demo.com", phone: "0909889900", gender: "Male", dob: "1997-02-25", department: "Customer Care", position: "CS Specialist", branch: "RinoEdu Linh Đàm", status: "active", salary: 14000000, hireDate: "2024-02-15", contractType: "Full-time", address: "Số 60 Nguyễn Hữu Thọ, Hoàng Mai, Hà Nội" },
  { id: "ld4", name: "Đào Thị Lan", email: "lan.ld@demo.com", phone: "0901990011", gender: "Female", dob: "1998-08-11", department: "Customer Care", position: "CS Specialist", branch: "RinoEdu Linh Đàm", status: "active", salary: 13500000, hireDate: "2024-04-10", contractType: "Full-time", address: "Số 88 Tân Mai, Hoàng Mai, Hà Nội" },
  { id: "ld5", name: "Phạm Hoàng Yến", email: "yen.ld@demo.com", phone: "0902001122", gender: "Female", dob: "1995-10-05", department: "Teaching", position: "Kids English Teacher", branch: "RinoEdu Linh Đàm", status: "active", salary: 18000000, hireDate: "2023-09-15", contractType: "Full-time", address: "Số 45 Bằng Liệt, Hoàng Mai, Hà Nội" },
  { id: "ld6", name: "Vũ Minh Khang", email: "khang.ld@demo.com", phone: "0903112233", gender: "Male", dob: "1994-01-20", department: "Teaching", position: "Grammar Teacher", branch: "RinoEdu Linh Đàm", status: "active", salary: 18500000, hireDate: "2023-06-01", contractType: "Full-time", address: "Số 150 Trương Định, Hoàng Mai, Hà Nội" },

  // --- RinoEdu Cầu Giấy (Chưa có đăng ký) ---
  { id: "cg1", name: "Nguyễn Văn Nam", email: "nam.cg@demo.com", phone: "0901239999", gender: "Male", dob: "1994-05-10", department: "Teaching", position: "IELTS Teacher", branch: "RinoEdu Cầu Giấy (Chưa có đăng ký)", status: "active", salary: 19000000, hireDate: "2024-01-01", contractType: "Full-time", address: "Số 180 Cầu Giấy, Dịch Vọng, Cầu Giấy, Hà Nội" },
  { id: "cg2", name: "Trần Mai Phương", email: "phuong.cg@demo.com", phone: "0902349999", gender: "Female", dob: "1996-08-15", department: "Teaching", position: "TOEIC Teacher", branch: "RinoEdu Cầu Giấy (Chưa có đăng ký)", status: "active", salary: 18000000, hireDate: "2024-02-01", contractType: "Full-time", address: "Số 26 ngõ 86 Chùa Hà, Quan Hoa, Cầu Giấy, Hà Nội" },
  { id: "cg3", name: "Lê Hoàng Quân", email: "quan.cg@demo.com", phone: "0903459999", gender: "Male", dob: "1998-11-20", department: "Customer Care", position: "CS Specialist", branch: "RinoEdu Cầu Giấy (Chưa có đăng ký)", status: "active", salary: 14000000, hireDate: "2024-03-01", contractType: "Full-time", address: "Số 95 Xuân Thủy, Dịch Vọng Hậu, Cầu Giấy, Hà Nội" },
  { id: "cg4", name: "Phạm Thu Thảo", email: "thao.cg@demo.com", phone: "0904569999", gender: "Female", dob: "2001-06-25", department: "Teaching", position: "Teaching Assistant", branch: "RinoEdu Cầu Giấy (Chưa có đăng ký)", status: "active", salary: 8500000, hireDate: "2024-04-01", contractType: "Part-time", address: "Ký túc xá Ngoại Ngữ, Phạm Văn Đồng, Cầu Giấy, Hà Nội" },
  { id: "cg5", name: "Đặng Minh Trí", email: "tri.cg@demo.com", phone: "0905679999", gender: "Male", dob: "1995-09-12", department: "Teaching", position: "Native Teacher", branch: "RinoEdu Cầu Giấy (Chưa có đăng ký)", status: "active", salary: 28000000, hireDate: "2024-01-15", contractType: "Full-time", address: "Tòa Discovery Complex, 302 Cầu Giấy, Hà Nội" },
]

export function getEmployees(filters?: { search?: string; branch?: string; department?: string; status?: string }): Employee[] {
  return mockEmployees.filter((e) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matchName = e.name.toLowerCase().includes(q)
      const matchEmail = e.email.toLowerCase().includes(q)
      const matchPhone = e.phone.includes(filters.search)
      const matchPos = e.position.toLowerCase().includes(q)
      const matchAddress = e.address.toLowerCase().includes(q)
      if (!matchName && !matchEmail && !matchPhone && !matchPos && !matchAddress) {
        return false
      }
    }
    if (filters?.branch && filters.branch !== 'all') {
      const inBranch = e.branch === filters.branch
      const inBranches = e.branches && e.branches.includes(filters.branch)
      if (!inBranch && !inBranches) return false
    }
    if (filters?.department && filters.department !== 'all' && e.department !== filters.department) {
      return false
    }
    if (filters?.status && filters.status !== 'all' && e.status !== filters.status) {
      return false
    }
    return true
  })
}
