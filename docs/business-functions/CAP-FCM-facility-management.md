# Capability: Facility Management (Năng lực Quản lý Cơ sở Vật chất)

**ID:** `CAP-FCM`  
**Domain:** Facility (Cơ sở vật chất)  
**Class:** Supporting Capability (Năng lực Hỗ trợ)

## 1. Mục tiêu & Phạm vi (Goal & Scope)
Năng lực quản trị vòng đời tài sản vật lý, không gian phòng học, và công tác bảo trì bảo dưỡng tại các điểm trường.
**Phạm vi:** Checklist vệ sinh/trang thiết bị phòng học định kỳ, quản lý danh mục tài sản, quản lý yêu cầu sửa chữa (Maintenance).

## 2. Thực thể dữ liệu cốt lõi (Key Entities)
*   **Asset:** Tài sản vật lý của trung tâm (Máy lạnh, Máy chiếu, Bàn ghế).
*   **Room / Facility:** Không gian phòng học, sảnh.
*   **Maintenance Request:** Yêu cầu bảo trì, sửa chữa.

## 3. Nguyên tắc Vận hành (Core Principles)
1. **Định kỳ kiểm tra:** Cơ sở vật chất phải được checklist định kỳ trước khi diễn ra các buổi học.
2. **Quản trị rủi ro vật lý:** Các phòng học không đủ tiêu chuẩn (hư hỏng thiết bị lõi) không được phép đưa vào xếp lịch học.

## 4. Giao tiếp liên miền (Cross-Capability Interactions)
*   👉 **Cung cấp dữ liệu cho `CAP-OPS`:** Đồng bộ danh sách Phòng học (Rooms) và tình trạng sử dụng để Hệ thống vận hành có thể xếp lịch học.
*   👉 **Nhận dữ liệu từ `CAP-CARE`:** Phụ huynh/Học viên có thể report các vấn đề CSVC, đẩy thành Maintenance Request.

## 5. Danh sách Business Functions (BF)
| Mã BF | Tên Business Function | Trạng thái |
|-------|-----------------------|------------|
| `BF-QA-02` | Facility Maintenance & Checklist | ⏳ Chờ làm |
