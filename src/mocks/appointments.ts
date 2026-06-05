export interface Appointment {
  id: string
  title: string
  type: "class" | "event" | "meeting" | "trial" | "consultation"
  startTime: string
  endTime: string
  branch: string
  room?: string
  teacher: string
  participants: string[]
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
  color?: string
}

export const mockAppointments: Appointment[] = [
  { id: "a1", title: "IELTS A1", type: "class", startTime: "2025-05-17T18:00:00Z", endTime: "2025-05-17T20:00:00Z", branch: "RinoEdu Nguyễn Tuân", room: "A101", teacher: "Phạm Văn Giảng Dạy", participants: ["Nguyễn An", "Lê Chi", "Giang", "Mai"], status: "scheduled", color: "#3b82f6" },
  { id: "a2", title: "TOEIC A2", type: "class", startTime: "2025-05-17T17:00:00Z", endTime: "2025-05-17T19:00:00Z", branch: "RinoEdu Smart City", room: "C301", teacher: "Phạm Văn Giảng Dạy", participants: ["Trần Bình", "Vũ Khánh"], status: "scheduled", color: "#10b981" },
  { id: "a3", title: "Tiếng Nhật N5", type: "class", startTime: "2025-05-17T19:00:00Z", endTime: "2025-05-17T21:00:00Z", branch: "RinoEdu Linh Đàm", room: "D401", teacher: "Hoàng Thị Giáo Viên", participants: ["Hoàng Em"], status: "scheduled", color: "#f59e0b" },
  { id: "a4", title: "Test thử IELTS", type: "trial", startTime: "2025-05-17T14:00:00Z", endTime: "2025-05-17T16:00:00Z", branch: "RinoEdu Nguyễn Tuân", room: "A103", teacher: "Phạm Văn Giảng Dạy", participants: ["Nguyễn Thị Lan"], status: "scheduled", color: "#ef4444" },
  { id: "a5", title: "Họp chi nhánh Q2", type: "meeting", startTime: "2025-05-17T10:00:00Z", endTime: "2025-05-17T11:30:00Z", branch: "RinoEdu Smart City", teacher: "Nguyễn Văn Quản Lý", participants: ["Nguyễn Văn Quản Lý", "Hoàng Thị Giáo Viên", "Lê Thị Chăm Sóc"], status: "completed", color: "#8b5cf6" },
  { id: "a6", title: "Tư vấn du học", type: "consultation", startTime: "2025-05-18T09:00:00Z", endTime: "2025-05-18T10:00:00Z", branch: "RinoEdu Nguyễn Tuân", teacher: "Trần Thị Sale", participants: ["Lê Thị Mai Anh"], status: "scheduled", color: "#06b6d4" },
  { id: "a7", title: "IELTS B1", type: "class", startTime: "2025-05-18T17:00:00Z", endTime: "2025-05-18T19:00:00Z", branch: "RinoEdu Linh Đàm", room: "B201", teacher: "Hoàng Thị Giáo Viên", participants: ["Phạm Dũng", "Nam"], status: "scheduled", color: "#3b82f6" },
  { id: "a8", title: "Sự kiện Open Day", type: "event", startTime: "2025-05-24T08:00:00Z", endTime: "2025-05-24T17:00:00Z", branch: "Toàn hệ thống", teacher: "Admin Demo", participants: ["Tất cả nhân viên"], status: "scheduled", color: "#ec4899" },
  { id: "a9", title: "Tiếng Anh A1", type: "class", startTime: "2025-05-19T18:30:00Z", endTime: "2025-05-19T20:30:00Z", branch: "RinoEdu Nguyễn Tuân", room: "A102", teacher: "Hoàng Thị Giáo Viên", participants: ["Lê Chi"], status: "scheduled", color: "#14b8a6" },
  { id: "a10", title: "IELTS C1", type: "class", startTime: "2025-05-19T20:00:00Z", endTime: "2025-05-19T22:00:00Z", branch: "RinoEdu Nguyễn Tuân", room: "A103", teacher: "Phạm Văn Giảng Dạy", participants: ["Giang"], status: "cancelled", color: "#f97316" },
]

export function getAppointments(filters?: { date?: string; branch?: string; type?: string; status?: string; teacher?: string }): Appointment[] {
  return mockAppointments.filter((a) => {
    if (filters?.date && !a.startTime.startsWith(filters.date)) return false
    if (filters?.branch && !a.branch.includes(filters.branch) && a.branch !== filters.branch) return false
    if (filters?.type && a.type !== filters.type) return false
    if (filters?.status && a.status !== filters.status) return false
    if (filters?.teacher && a.teacher !== filters.teacher) return false
    return true
  })
}
