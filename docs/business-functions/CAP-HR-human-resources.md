# Capability: HR & Organization (Năng lực Tổ chức & Nhân sự)

**ID:** `CAP-HR`  
**Domain:** HR & Organization (Tổ chức & Nhân sự)  
**Class:** Supporting & Governance (Hỗ trợ & Quản trị)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản lý sơ đồ cơ cấu tổ chức (Org Chart) cho mô hình chuỗi đa chi nhánh, đồng thời quản lý hồ sơ nhân viên, vòng đời nhân sự và phân ca làm việc.
**Phạm vi:** Bắt đầu từ khi thành lập một chi nhánh mới trên hệ thống, onboarding nhân sự vào chi nhánh đó, cho đến khi nhân sự nghỉ việc hoặc luân chuyển công tác.

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Branch/Center (Chi nhánh/Cơ sở):** Đơn vị vật lý trực tiếp giảng dạy.
*   **Department (Phòng ban):** Cơ cấu phòng ban trực thuộc trung tâm (Ví dụ: Phòng Giáo vụ, Phòng Tuyển sinh).
*   **Employee Profile (Hồ sơ Nhân sự):** Thông tin cá nhân, Hợp đồng, Role công việc.
*   **Work Registration (Đăng ký Lịch làm việc):** Quỹ thời gian rảnh/bận do giáo viên khai báo (Available time slots).

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Liên kết Chi nhánh (Branch Binding):** Mọi nhân sự đều phải được gắn (bind) với ít nhất một Chi nhánh hoặc Phòng ban. Không có nhân sự "trôi nổi".
2. **Nguồn gốc dữ liệu thời gian:** Dữ liệu Đăng ký lịch làm việc (Work Registration) trên hệ thống HR là "Sự thật duy nhất" (Single Source of Truth) để đánh giá việc một giáo viên có thể nhận lớp hay không.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Cấp dữ liệu cho `CAP-OPS`:** Luồng Xếp lịch học (Class Scheduling) của OPS bắt buộc phải query dữ liệu rảnh rỗi của giáo viên từ HR để check xung đột (Conflict Resolution).
*   👉 **Cấp dữ liệu cho `CAP-SYS`:** Dựa vào chức danh/chi nhánh của nhân viên ở HR, Hệ thống `CAP-SYS` mới quyết định cấp quyền (Permissions) gì cho tài khoản đó.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function (Luồng E2E) | Trạng thái |
|-------|-----------------------------------|------------|
| `BF-ORG-01` | Branch Setup & Opening Process (Thiết lập & Khai trương chi nhánh) | ⏳ Chờ làm |
| `BF-ORG-02` | Organization Structure Governance (Quản trị sơ đồ tổ chức) | ⏳ Chờ làm |
| `BF-HR-01` | Staff Onboarding & Offboarding Lifecycle (Vòng đời nhân sự) | ✅ Đã có US |
| `BF-HR-02` | Staff Availability & Work Registration (Đăng ký quỹ thời gian) | ✅ Đã chuẩn hóa |
