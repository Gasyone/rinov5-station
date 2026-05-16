# Capability: Academic Management (Năng lực Học thuật)

**ID:** `CAP-ACD`  
**Domain:** Academic (Học thuật)  
**Class:** Core Operational (Vận hành Lõi)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản lý toàn bộ "chất xám" giảng dạy của trung tâm bao gồm: cấu trúc chương trình, lộ trình học thuật, giáo trình, và bộ tiêu chuẩn đánh giá kỹ năng. 
**Phạm vi:** Bắt đầu từ lúc Giám đốc Học thuật tạo mới một giáo trình/chương trình đào tạo, đến lúc xuất bản Khung chương trình (Syllabus) để các trung tâm có thể mở lớp. Năng lực này **không** quản lý việc học viên đang học bài nào (việc đó thuộc về Vận hành lớp - OPS).

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Program (Chương trình đào tạo):** Ví dụ: "Tiếng Anh Mầm Non", "IELTS Đảm bảo".
*   **Learning Path (Lộ trình học):** Mối liên hệ cấp bậc. Ví dụ: Học xong Pre-IELTS mới lên được IELTS 5.0.
*   **Curriculum (Giáo trình):** Sách giáo khoa, bộ tài liệu đi kèm.
*   **Syllabus (Khung chương trình):** Bản thiết kế chi tiết từng buổi học (Buổi 1 dạy bài gì, buổi 5 kiểm tra giữa kỳ).
*   **Skill Category (Bộ kỹ năng):** Thang đo đánh giá (Nghe, Nói, Đọc, Viết) dùng cho việc chấm điểm.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Tính độc lập & Kế thừa:** Nội dung học thuật phải độc lập với Vận hành lớp học. Lớp học chỉ "mượn" (inherit) một bản sao (blueprint) của Syllabus để chạy thực tế.
2. **Version Control:** Khi Syllabus được cập nhật (ví dụ từ version 1.0 lên 2.0), các Lớp học đang chạy version cũ không bị ảnh hưởng, chỉ áp dụng cho lớp mới mở.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Cấp dữ liệu cho `CAP-OPS`:** Cung cấp Syllabus để bộ phận Giáo vụ sinh ra cấu trúc các Buổi học (Sessions) tương ứng cho một Lớp.
*   👉 **Cấp dữ liệu cho `CAP-ENR`:** Cung cấp chuẩn đầu vào (Placement requirement) để bộ phận Tuyển sinh biết học viên test đầu vào được mấy điểm thì xếp vào Program nào.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-ACD-01` | Quản lý Chương trình đào tạo (Program Management) | ⏳ Chờ làm |
| `BF-ACD-02` | Lộ trình học (Learning Path) | ⏳ Chờ làm |
| `BF-ACD-03` | Khung chương trình (Syllabus) | ⏳ Chờ làm |
| `BF-ACD-04` | Thành phần bài học (Lesson Components) | ⏳ Chờ làm |
| `BF-ACD-05` | Nhóm kỹ năng (Skill Category) | ⏳ Chờ làm |
| `BF-ACD-06` | Giáo trình (Curriculum) | ⏳ Chờ làm |
| `BF-ACD-07` | Thiết lập học thuật (Academic Settings) | ⏳ Chờ làm |
| `BF-QA-01` | Đánh giá chất lượng giảng dạy (Academic QC) | ⏳ Chờ làm |
