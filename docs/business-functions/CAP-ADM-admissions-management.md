# Capability: Admissions Management (Năng lực Quản lý Tuyển sinh)

**ID:** `CAP-ADM`  
**Domain:** Admissions (Tuyển sinh)  
**Class:** Core Operational (Vận hành Lõi)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản lý các hoạt động đầu vào liên quan đến sắp xếp và tổ chức trải nghiệm/đánh giá năng lực học viên trước khi nhập học.
**Phạm vi:** Tập trung ĐỘC QUYỀN vào các nghiệp vụ Đặt lịch (Booking), Tổ chức thi đầu vào (Test/Assessment) và Tổ chức học thử (Trial). 
*(Các hoạt động tìm kiếm Lead (CRM) và tư vấn chốt Sale không thuộc phạm vi này mà nằm ở các CAP tương ứng).*

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Assessment / Trial Booking:** Lịch hẹn thi test đầu vào hoặc học thử.
*   **Assessment Result:** Kết quả điểm thi (Toán/Tiếng Anh)/đánh giá năng lực.
*   **Teacher Feedback:** Nhận xét, đánh giá của giáo viên sau buổi học thử.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Data-driven Placement:** Điểm kiểm tra năng lực hoặc kết quả học thử là cơ sở dữ liệu bắt buộc để đưa ra quyết định xếp lớp chính thức.
2. **Resource Optimization:** Các buổi test và học thử (đặc biệt là ghép buổi) phải được điều phối chặt chẽ dựa trên sức chứa (capacity) của phòng/lớp và lịch trống của giáo viên.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Nhận dữ liệu từ `CAP-MDM`:** Nhận hồ sơ khách hàng (Profile) để tiến hành đặt lịch.
*   👉 **Nhận dữ liệu từ `CAP-ACD`:** Lấy khung chương trình, đề test chuẩn để thực hiện đánh giá.
*   👉 **Giao tiếp với `CAP-COM` (Commerce):** Sau khi có kết quả Test/Trial, trả dữ liệu (Report Link, Feedback) về để bộ phận Sales tư vấn chốt Hợp đồng.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-CRM-01` | Lead Generation & Qualification (Quản lý khách hàng tiềm năng) | ⏳ Chờ làm |
| `BF-CRM-02` | Sales Pipeline & Opportunity Mgt (Follow-up & Tương tác) | ⏳ Chờ làm |
| `BF-ENR-01` | Booking Test & Assessment (Kiểm tra đầu vào) | ✅ Chuẩn vàng |
| `BF-ENR-02` | Trial Booking & Execution (Học thử ghép buổi) | ✅ Chuẩn vàng |
| `BF-ENR-03` | Quản lý sự kiện tuyển sinh (Enrollment Event Management) | ⏳ Chờ làm |
| `BF-SAL-03` | Đánh giá năng lực (Placement Assessment & Recommendation) | ⏳ Chờ làm |
