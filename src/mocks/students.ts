export interface Student {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  gender: "Male" | "Female" | "Other"
  dob: string
  status: "active" | "inactive" | "pending" | "graduated" | "transferred"
  enrolledClass?: string
  branch: string
  level: string
  parentName?: string
  parentPhone?: string
  enrollmentDate: string
  notes?: string
}

const firstNames = ["An", "Bình", "Chi", "Dũng", "Em", "Giang", "Hiếu", "Khánh", "Mai", "Nam", "Oanh", "Phong", "Quỳnh", "Sơn", "Trang", "Việt", "Xuân", "Yến", "Long", "Hằng"]
const lastNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Nguyễn", "Trần", "Vũ", "Đặng", "Ngô", "Bùi", "Đỗ", "Hồ"]

const makeName = (i: number) => `${lastNames[i % lastNames.length]} ${firstNames[i % firstNames.length]}`

export const mockStudents: Student[] = [
  { id: "s1", name: makeName(0), email: `an@email.com`, phone: "0911111111", gender: "Male", dob: "2005-03-15", status: "active", enrolledClass: "IELTS A1", branch: "Chi nhánh Hà Nội", level: "IELTS", parentName: "Nguyễn Văn A", parentPhone: "0922222222", enrollmentDate: "2025-01-10" },
  { id: "s2", name: makeName(1), email: `binh@email.com`, phone: "0933333333", gender: "Female", dob: "2007-07-20", status: "active", enrolledClass: "TOEIC B2", branch: "Chi nhánh Hồ Chí Minh", level: "TOEIC", parentName: "Trần Thị B", parentPhone: "0944444444", enrollmentDate: "2025-02-15" },
  { id: "s3", name: makeName(2), email: `chi@email.com`, phone: "0955555555", gender: "Female", dob: "2008-11-05", status: "inactive", enrolledClass: "Tiếng Anh A1", branch: "Chi nhánh Hà Nội", level: "Beginner", parentName: "Lê Văn C", parentPhone: "0966666666", enrollmentDate: "2025-03-01", notes: "Chưa thanh toán đủ học phí" },
  { id: "s4", name: makeName(3), email: `dung@email.com`, phone: "0977777777", gender: "Male", dob: "2006-04-10", status: "active", enrolledClass: "IELTS B1", branch: "Chi nhánh Đà Nẵng", level: "IELTS", parentName: "Phạm Thị D", parentPhone: "0988888888", enrollmentDate: "2025-04-20" },
  { id: "s5", name: makeName(4), email: `em@email.com`, phone: "0999999999", gender: "Other", dob: "2009-08-25", status: "pending", enrolledClass: "Tiếng Nhật N5", branch: "Chi nhánh Hồ Chí Minh", level: "Japanese", parentName: "Hoàng Văn E", parentPhone: "0910101010", enrollmentDate: "2025-05-15" },
  { id: "s6", name: makeName(5), email: `giang@email.com`, phone: "0912121212", gender: "Female", dob: "2004-12-01", status: "graduated", enrolledClass: "IELTS C1", branch: "Chi nhánh Hà Nội", level: "IELTS", parentName: "Nguyễn Thị G", parentPhone: "0913131313", enrollmentDate: "2024-09-01" },
  { id: "s7", name: makeName(6), email: `hieu@email.com`, phone: "0914141414", gender: "Male", dob: "2003-06-30", status: "transferred", enrolledClass: "TOEIC A2", branch: "Chi nhánh Đà Nẵng", level: "TOEIC", parentName: "Trần Văn H", parentPhone: "0915151515", enrollmentDate: "2024-11-15", notes: "Chuyển sang CN HCM" },
  { id: "s8", name: makeName(7), email: `khanh@email.com`, phone: "0916161616", gender: "Male", dob: "2008-01-11", status: "active", enrolledClass: "Tiếng Anh B1", branch: "Chi nhánh Hồ Chí Minh", level: "English", parentName: "Lê Thị K", parentPhone: "0917171717", enrollmentDate: "2025-02-28" },
  { id: "s9", name: makeName(8), email: `mai@email.com`, phone: "0918181818", gender: "Female", dob: "2010-05-18", status: "active", enrolledClass: "Tiếng Anh A2", branch: "Chi nhánh Hà Nội", level: "English", parentName: "Vũ Văn M", parentPhone: "0919191919", enrollmentDate: "2025-04-10" },
  { id: "s10", name: makeName(9), email: `nam@email.com`, phone: "0920202020", gender: "Male", dob: "2002-09-22", status: "active", enrolledClass: "IELTS A2", branch: "Chi nhánh Đà Nẵng", level: "IELTS", enrollmentDate: "2025-05-01" },
]

export function getStudents(filters?: { search?: string; branch?: string; status?: string; level?: string }): Student[] {
  return mockStudents.filter((s) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matches =
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        (s.phone?.toLowerCase().includes(q) ?? false)
      if (!matches) return false
    }
    if (filters?.branch && s.branch !== filters.branch) return false
    if (filters?.status && s.status !== filters.status) return false
    if (filters?.level && s.level !== filters.level) return false
    return true
  })
}
