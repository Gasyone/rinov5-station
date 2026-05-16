export interface Contact {
  id: string
  name: string
  email?: string
  phone: string
  source: "walk_in" | "facebook" | "referral" | "website" | "google" | "event"
  status: "new" | "contacted" | "qualified" | "converted" | "lost"
  branch: string
  assignedTo: string
  interest?: string
  notes?: string
  lastInteraction?: string
  createdAt: string
}

export const mockContacts: Contact[] = [
  { id: "c1", name: "Nguyễn Thị Lan", email: "lan@email.com", phone: "0911222333", source: "facebook", status: "new", branch: "Chi nhánh Hà Nội", assignedTo: "Trần Thị Sale", interest: "Khóa học IELTS", createdAt: "2025-05-15T08:00:00Z" },
  { id: "c2", name: "Trần Minh Đức", email: "duc@email.com", phone: "0912333444", source: "website", status: "contacted", branch: "Chi nhánh Hồ Chí Minh", assignedTo: "Trần Thị Sale", interest: "Khóa học TOEIC", lastInteraction: "2025-05-16T10:00:00Z", createdAt: "2025-05-14T11:00:00Z" },
  { id: "c3", name: "Lê Thị Mai Anh", email: "anh@email.com", phone: "0913444555", source: "referral", status: "qualified", branch: "Chi nhánh Hà Nội", assignedTo: "Trần Thị Sale", interest: "Khóa học Tiếng Nhật", lastInteraction: "2025-05-16T15:00:00Z", createdAt: "2025-05-13T09:00:00Z", notes: "Giới thiệu từ học viên cũ" },
  { id: "c4", name: "Phạm Quốc Tuấn", phone: "0914555666", source: "walk_in", status: "converted", branch: "Chi nhánh Đà Nẵng", assignedTo: "Trần Thị Sale", interest: "Khóa học IELTS", lastInteraction: "2025-05-15T16:00:00Z", createdAt: "2025-05-10T10:00:00Z", notes: "Đã đăng ký khóa IELTS A1" },
  { id: "c5", name: "Hoàng Thị Hương", email: "huong@email.com", phone: "0915666777", source: "google", status: "new", branch: "Chi nhánh Hồ Chí Minh", assignedTo: "Trần Thị Sale", interest: "Khóa học Tiếng Anh", createdAt: "2025-05-17T07:00:00Z" },
  { id: "c6", name: "Vũ Ngọc Linh", email: "linh@email.com", phone: "0916777888", source: "event", status: "contacted", branch: "Chi nhánh Hà Nội", assignedTo: "Trần Thị Sale", interest: "Khóa học IELTS", createdAt: "2025-05-12T14:00:00Z" },
  { id: "c7", name: "Đặng Văn Khoa", phone: "0917888999", source: "facebook", status: "lost", branch: "Chi nhánh Đà Nẵng", assignedTo: "Trần Thị Sale", interest: "Khóa học TOEIC", createdAt: "2025-05-01T08:00:00Z", notes: "Không liên lạc lại được" },
  { id: "c8", name: "Ngô Thị Hạnh", email: "hanh@email.com", phone: "0918999000", source: "website", status: "qualified", branch: "Chi nhánh Hồ Chí Minh", assignedTo: "Trần Thị Sale", interest: "Combo IELTS", lastInteraction: "2025-05-16T11:00:00Z", createdAt: "2025-05-14T10:30:00Z" },
]

export function getContacts(filters?: { search?: string; branch?: string; status?: string; source?: string }): Contact[] {
  return mockContacts.filter((c) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (!c.name.toLowerCase().includes(q) && !c.email?.toLowerCase().includes(q) && !c.phone.includes(filters.search)) return false
    }
    if (filters?.branch && c.branch !== filters.branch) return false
    if (filters?.status && c.status !== filters.status) return false
    if (filters?.source && c.source !== filters.source) return false
    return true
  })
}
