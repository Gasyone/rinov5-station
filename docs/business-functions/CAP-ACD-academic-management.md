---
title: "Năng lực Học thuật & Đào tạo"
type: "Capability"
domain: "CAP-ACD"
status: "Active"
id: "CAP-ACD"
parent_br: "TBD-NEEDS-BR"
---

# Capability: Năng lực Học thuật & Đào tạo

**ID:** `CAP-ACD`  
**Domain:** Học thuật & Đào tạo  
**Phân loại:** Năng lực Cốt lõi

---

## 1. Mục tiêu & Phạm vi

Quản lý toàn bộ "chất xám" giảng dạy của trung tâm: cấu trúc chương trình, lộ trình học thuật, giáo trình, và bộ tiêu chuẩn đánh giá kỹ năng.

**Phạm vi:** Bắt đầu từ lúc Giám đốc Học thuật tạo mới một giáo trình/chương trình đào tạo, đến lúc xuất bản Khung chương trình để các trung tâm có thể mở lớp. Năng lực này **không** quản lý việc học viên đang học bài nào (việc đó thuộc Vận hành lớp — CAP-OPS).

## 2. Thực thể Dữ liệu cốt lõi

*   **Chương trình đào tạo:** Ví dụ: "Tiếng Anh Mầm Non", "IELTS Đảm bảo".
*   **Lộ trình học:** Mối liên hệ cấp bậc. Ví dụ: Học xong Pre-IELTS mới lên được IELTS 5.0.
*   **Giáo trình:** Sách giáo khoa, bộ tài liệu đi kèm.
*   **Khung chương trình:** Bản thiết kế chi tiết từng buổi học (Buổi 1 dạy bài gì, buổi 5 kiểm tra giữa kỳ).
*   **Bộ kỹ năng:** Thang đo đánh giá (Nghe, Nói, Đọc, Viết) dùng cho việc chấm điểm.
*   **Tham số Học thuật:** Thời lượng mặc định buổi học, sĩ số tối đa, lịch nghỉ lễ.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Phân quyền xem chương trình đào tạo theo chi nhánh/phân vùng.

**Nguyên tắc riêng của Học thuật:**
1. **Tính độc lập & Kế thừa:** Nội dung học thuật phải độc lập với Vận hành lớp học. Lớp học chỉ "mượn" bản sao Khung chương trình.
2. **Quản lý phiên bản:** Khi Khung chương trình cập nhật, chỉ áp dụng cho lớp mở mới. Lớp cũ giữ nguyên phiên bản cũ.

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Học thuật thiết kế theo nguyên tắc **phân tầng nội dung**:
- **Tầng 1 — Chương trình:** Định nghĩa sản phẩm đào tạo (Program).
- **Tầng 2 — Lộ trình:** Xác định thứ tự tiến trình giữa các chương trình.
- **Tầng 3 — Khung chương trình:** Chi tiết từng buổi, từng bài học.
- **Tầng 4 — Giáo trình & Kỹ năng:** Tài liệu và thang đo đánh giá.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-OPS`: Cung cấp Khung chương trình để Giáo vụ sinh ra cấu trúc các Buổi học cho một Lớp.
    - `CAP-ADM`: Cung cấp chuẩn đầu vào để Tuyển sinh biết xếp học viên vào chương trình nào.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-OPS`: Nhận phản hồi về tiến độ thực tế để điều chỉnh Khung chương trình.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Chương trình đào tạo | ✅ | |
| Lộ trình học | ✅ | |
| Khung chương trình | ✅ | |
| Giáo trình | ✅ | |
| Bộ kỹ năng | ✅ | |
| Tham số Học thuật (Sĩ số, Thời lượng) | ✅ | |
| Lịch nghỉ lễ Học thuật | ✅ | |
| Buổi học thực tế | | → `CAP-OPS` |
| Điểm danh / Nhận xét | | → `CAP-OPS` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-ACD-01` | Quản lý Chương trình đào tạo | ⏳ Chờ làm |
| `BF-ACD-02` | Lộ trình học | ⏳ Chờ làm |
| `BF-ACD-03` | Khung chương trình | ⏳ Chờ làm |
| `BF-ACD-04` | Thành phần bài học | ⏳ Chờ làm |
| `BF-ACD-05` | Nhóm kỹ năng | ⏳ Chờ làm |
| `BF-ACD-06` | Giáo trình | ⏳ Chờ làm |
| `BF-ACD-07` | Thiết lập học thuật | ✅ Đã chuẩn hóa |
| `BF-QA-01` | Đánh giá chất lượng giảng dạy | ⏳ Chờ làm |
