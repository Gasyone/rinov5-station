export interface Product {
  id: string
  name: string
  code: string
  category: "course" | "book" | "service" | "combo"
  price: number
  status: "active" | "inactive" | "archived"
  branch: string
  description?: string
  duration?: string
  tags?: string[]
  createdAt: string
}

export const mockProducts: Product[] = [
  { id: "p1", name: "Khóa học IELTS", code: "CRS-IELTS", category: "course", price: 3500000, status: "active", branch: "Toàn hệ thống", description: "Khóa học IELTS từ A1 đến C1", duration: "3 tháng", tags: ["ielts", "english"], createdAt: "2024-06-01" },
  { id: "p2", name: "Khóa học TOEIC", code: "CRS-TOEIC", category: "course", price: 2500000, status: "active", branch: "Toàn hệ thống", description: "Khóa học TOEIC từ A2 đến B2", duration: "3 tháng", tags: ["toeic", "english"], createdAt: "2024-06-01" },
  { id: "p3", name: "Khóa học Tiếng Nhật N5", code: "CRS-JP5", category: "course", price: 4000000, status: "active", branch: "RinoEdu Smart City", description: "Khóa học tiếng Nhật trình độ N5", duration: "4 tháng", tags: ["japanese", "n5"], createdAt: "2024-09-01" },
  { id: "p4", name: "Khóa học Tiếng Anh A1-B1", code: "CRS-EN01", category: "course", price: 2000000, status: "active", branch: "Toàn hệ thống", description: "Khóa học tiếng Anh cơ bản", duration: "3 tháng", tags: ["english", "beginner"], createdAt: "2024-06-01" },
  { id: "p5", name: "Sách IELTS Preparation", code: "BK-IELTS01", category: "book", price: 150000, status: "active", branch: "Toàn hệ thống", description: "Giáo trình ôn thi IELTS", tags: ["ielts", "book"], createdAt: "2024-07-01" },
  { id: "p6", name: "Sách TOEIC Complete", code: "BK-TOEIC01", category: "book", price: 120000, status: "active", branch: "Toàn hệ thống", description: "Giáo trình luyện thi TOEIC", tags: ["toeic", "book"], createdAt: "2024-07-01" },
  { id: "p7", name: "Test IELTS 1 Kỹ Năng", code: "SRVC-TEST", category: "service", price: 300000, status: "active", branch: "Toàn hệ thống", description: "Bài test 1 kỹ năng IELTS", duration: "2 tiếng", createdAt: "2024-08-01" },
  { id: "p8", name: "Combo IELTS A1+B1", code: "COMBO-IELTS01", category: "combo", price: 6000000, status: "active", branch: "RinoEdu Nguyễn Tuân", description: "Combo 2 khóa IELTS A1 và B1 (tiết kiệm)", tags: ["ielts", "combo"], createdAt: "2024-10-01" },
  { id: "p9", name: "Khóa học Tiếng Hàn Sơ Cấp", code: "CRS-KR", category: "course", price: 3800000, status: "inactive", branch: "RinoEdu Smart City", description: "Khóa học tiếng Hàn sơ cấp", duration: "4 tháng", tags: ["korean", "beginner"], createdAt: "2024-12-01" },
  { id: "p10", name: "Tư Vấn Du Học", code: "SRVC-CONSULT", category: "service", price: 500000, status: "active", branch: "Toàn hệ thống", description: "Buổi tư vấn du học 1 tiếng", duration: "1 tiếng", createdAt: "2025-01-01" },
]

export function getProducts(filters?: { search?: string; category?: string; branch?: string; status?: string }): Product[] {
  return mockProducts.filter((p) => {
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      if (!p.name.toLowerCase().includes(q) && !p.code.toLowerCase().includes(q)) return false
    }
    if (filters?.category && p.category !== filters.category) return false
    if (filters?.branch && p.branch !== filters.branch) return false
    if (filters?.status && p.status !== filters.status) return false
    return true
  })
}
