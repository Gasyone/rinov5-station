export interface Employee {
  id: string
  name: string
  email: string
  phone: string
  gender: "Male" | "Female" | "Other"
  dob: string
  department: string
  position: string
  branch: string
  status: "active" | "inactive" | "probation" | "resigned"
  salary: number
  hireDate: string
  contractType: "Full-time" | "Part-time" | "Contract"
  avatar?: string
  address?: string
  emergencyContact?: string
}

export const mockEmployees: Employee[] = [
  { id: "e1", name: "Nguyễn Văn Quản Lý", email: "manager.hcm@demo.com", phone: "0909876543", gender: "Male", dob: "1990-05-15", department: "Management", position: "Branch Manager", branch: "RinoEdu Smart City", status: "active", salary: 25000000, hireDate: "2023-01-15", contractType: "Full-time", address: "123 Nguyễn Huệ, Q1, TP.HCM" },
  { id: "e2", name: "Trần Thị Sale", email: "sale1@demo.com", phone: "0901112233", gender: "Female", dob: "1995-08-20", department: "Sales", position: "Sales Executive", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 15000000, hireDate: "2024-03-01", contractType: "Full-time", address: "456 Đường Láng, Đống Đa, Hà Nội" },
  { id: "e3", name: "Phạm Văn Giảng Dạy", email: "teacher1@demo.com", phone: "0903334455", gender: "Male", dob: "1988-12-10", department: "Teaching", position: "IELTS Teacher", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 20000000, hireDate: "2022-09-01", contractType: "Full-time", address: "789 Lê Văn Lương, Thanh Xuân, Hà Nội" },
  { id: "e4", name: "Hoàng Thị Giáo Viên", email: "teacher2@demo.com", phone: "0904445566", gender: "Female", dob: "1992-03-25", department: "Teaching", position: "English Teacher", branch: "RinoEdu Smart City", status: "active", salary: 18000000, hireDate: "2023-06-15", contractType: "Full-time", address: "321 Điện Biên Phủ, Bình Thạnh, TP.HCM" },
  { id: "e5", name: "Lê Thị Chăm Sóc", email: "csm1@demo.com", phone: "0902223344", gender: "Female", dob: "1997-07-30", department: "Customer Care", position: "CSM Specialist", branch: "RinoEdu Smart City", status: "active", salary: 14000000, hireDate: "2024-01-10", contractType: "Full-time" },
  { id: "e6", name: "Đặng Văn Bắc", email: "manager.hn@demo.com", phone: "0905556677", gender: "Male", dob: "1985-11-08", department: "Management", position: "Branch Manager", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 26000000, hireDate: "2022-06-01", contractType: "Full-time", address: "159 Nguyễn Trãi, Thanh Xuân, Hà Nội" },
  { id: "e7", name: "Vũ Văn Reception", email: "reception@demo.com", phone: "0906667788", gender: "Male", dob: "2000-04-15", department: "Admin", position: "Receptionist", branch: "RinoEdu Linh Đàm", status: "probation", salary: 8000000, hireDate: "2026-04-11", contractType: "Full-time" },
  { id: "e8", name: "Ngô Thị Accounting", email: "accounting@demo.com", phone: "0907778899", gender: "Female", dob: "1993-09-22", department: "Finance", position: "Accountant", branch: "RinoEdu Nguyễn Tuân", status: "active", salary: 16000000, hireDate: "2023-02-15", contractType: "Full-time" },
  { id: "e9", name: "Bùi Văn Support", email: "support@demo.com", phone: "0908889900", gender: "Male", dob: "1998-01-30", department: "IT", position: "IT Support", branch: "RinoEdu Smart City", status: "active", salary: 17000000, hireDate: "2023-11-01", contractType: "Full-time" },
  { id: "e10", name: "Đỗ Thị Part-time", email: "parttime@demo.com", phone: "0909990011", gender: "Female", dob: "2002-06-10", department: "Teaching", position: "Part-time Tutor", branch: "RinoEdu Linh Đàm", status: "active", salary: 5000000, hireDate: "2025-01-15", contractType: "Part-time" },
  { id: "e11", name: "Hồ Văn Đã Nghỉ", email: "resigned@demo.com", phone: "0910102020", gender: "Male", dob: "1991-04-05", department: "Sales", position: "Sales Executive", branch: "RinoEdu Linh Đàm", status: "resigned", salary: 0, hireDate: "2023-06-01", contractType: "Full-time" },
  { id: "e12", name: "Nguyễn Hoàng Sale", email: "sale2@demo.com", phone: "0901112244", gender: "Male", dob: "1996-10-12", department: "Sales", position: "Sales Executive", branch: "RinoEdu Linh Đàm", status: "active", salary: 14500000, hireDate: "2024-05-15", contractType: "Full-time", address: "12 Láng Hạ, Ba Đình, Hà Nội" },
]

export function getEmployees(filters?: { search?: string; branch?: string; department?: string; status?: string }): Employee[] {
  return mockEmployees.filter((e) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (!e.name.toLowerCase().includes(q) && !e.email.toLowerCase().includes(q) && !e.phone.includes(filters.search)) return false
    }
    if (filters?.branch && e.branch !== filters.branch) return false
    if (filters?.department && e.department !== filters.department) return false
    if (filters?.status && e.status !== filters.status) return false
    return true
  })
}
