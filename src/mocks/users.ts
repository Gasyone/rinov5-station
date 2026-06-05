export interface User {
  id: string
  email: string
  username: string
  fullName: string
  role: "admin" | "branch_manager" | "sale" | "csm" | "teacher"
  status: "active" | "inactive" | "locked"
  branch: string
  phone?: string
  avatar?: string
  lastLogin?: string
  createdAt: string
}

export const mockUsers: User[] = [
  { id: "u1", email: "admin@demo.com", username: "admin", fullName: "Admin Demo", role: "admin", status: "active", branch: "Toàn hệ thống", phone: "0901234567", avatar: "/avatar-admin.jpg", lastLogin: "2026-05-17T08:00:00Z", createdAt: "2025-01-01T00:00:00Z" },
  { id: "u2", email: "manager.hcm@demo.com", username: "manager.hcm", fullName: "Nguyễn Văn Quản Lý", role: "branch_manager", status: "active", branch: "RinoEdu Smart City", phone: "0909876543", lastLogin: "2026-05-16T14:00:00Z", createdAt: "2025-01-10T00:00:00Z" },
  { id: "u3", email: "sale1@demo.com", username: "sale1", fullName: "Trần Thị Sale", role: "sale", status: "active", branch: "RinoEdu Nguyễn Tuân", phone: "0901112233", lastLogin: "2026-05-17T07:00:00Z", createdAt: "2025-02-15T00:00:00Z" },
  { id: "u4", email: "csm1@demo.com", username: "csm1", fullName: "Lê Thị Chăm Sóc", role: "csm", status: "active", branch: "RinoEdu Smart City", phone: "0902223344", createdAt: "2025-03-01T00:00:00Z" },
  { id: "u5", email: "teacher1@demo.com", username: "teacher1", fullName: "Phạm Văn Giảng Dạy", role: "teacher", status: "active", branch: "RinoEdu Nguyễn Tuân", phone: "0903334455", lastLogin: "2026-05-17T06:30:00Z", createdAt: "2025-03-10T00:00:00Z" },
  { id: "u6", email: "inactive@demo.com", username: "inactive", fullName: "Ngô Văn Khóa", role: "sale", status: "inactive", branch: "RinoEdu Linh Đàm", createdAt: "2025-04-01T00:00:00Z" },
  { id: "u7", email: "teacher2@demo.com", username: "teacher2", fullName: "Hoàng Thị Giáo Viên", role: "teacher", status: "active", branch: "RinoEdu Smart City", phone: "0904445566", lastLogin: "2026-05-16T17:00:00Z", createdAt: "2025-04-15T00:00:00Z" },
  { id: "u8", email: "manager.hn@demo.com", username: "manager.hn", fullName: "Đặng Văn Bắc", role: "branch_manager", status: "active", branch: "RinoEdu Nguyễn Tuân", phone: "0905556677", lastLogin: "2026-05-17T08:30:00Z", createdAt: "2025-05-01T00:00:00Z" },
]

export function getUsers(filters?: { search?: string; role?: string; branch?: string; status?: string }): User[] {
  return mockUsers.filter((u) => {
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      if (!u.fullName.toLowerCase().includes(s) && !u.email.toLowerCase().includes(s) && !u.username.toLowerCase().includes(s)) return false
    }
    if (filters?.role && u.role !== filters.role) return false
    if (filters?.branch && u.branch !== filters.branch) return false
    if (filters?.status && u.status !== filters.status) return false
    return true
  })
}
