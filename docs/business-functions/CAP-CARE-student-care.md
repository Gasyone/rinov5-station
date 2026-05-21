---
title: "Năng lực Chăm sóc Học viên"
type: "Capability"
domain: "CAP-CARE"
status: "Active"
id: "CAP-CARE"
parent_br: "BR-001"
---

# Capability: Năng lực Chăm sóc Học viên

**ID:** `CAP-CARE`  
**Domain:** Chăm sóc Học viên  
**Phân loại:** Năng lực Cốt lõi

---

## 1. Mục tiêu & Phạm vi

Quản lý vòng đời chăm sóc học viên sau khi họ đã chính thức ghi danh và tham gia học tập.

**Phạm vi:** Từ lúc học viên học buổi đầu tiên, quản lý các tương tác thường xuyên (nhắn tin, gọi điện hỏi thăm), xử lý khiếu nại, cho đến quá trình thúc đẩy Tái phí khi học viên sắp kết thúc khóa học.

## 2. Thực thể Dữ liệu cốt lõi

*   **Học viên hiện hữu:** Khách hàng đang có trạng thái "Đang học" hoặc "Bảo lưu".
*   **Phiếu chăm sóc / Nhật ký tương tác:** Các vé chăm sóc và lịch sử ghi chú nội dung.
*   **Phễu tái phí:** Danh sách học viên sắp hết hạn học phí/buổi học cần gia hạn.

## 3. Tuân thủ Tiêu chuẩn (Policy Compliance)

Khối năng lực này chịu sự ràng buộc của các điều luật cốt lõi trong `ENTERPRISE_STANDARDS.md`:
1. **Tuân thủ `[POLICY-ORG-01]`:** Nhân viên chăm sóc chỉ xem được học viên thuộc chi nhánh mình quản lý.

**Nguyên tắc riêng của Chăm sóc:**
1. **Tách biệt với Tuyển sinh:** Tuyển sinh giải quyết khách hàng "chưa chốt", Chăm sóc tập trung tối ưu hóa giá trị vòng đời khách hàng "đã chốt".
2. **Kích hoạt tự động:** Kịch bản chăm sóc hoặc quy trình tái phí tự động nảy sinh dựa trên thời lượng học còn lại hoặc sự kiện (ví dụ: học viên nghỉ 3 buổi liên tiếp → tự sinh phiếu chăm sóc).

## 4. Kiến trúc & Nguyên tắc cốt lõi

Khối Chăm sóc vận hành theo mô hình **Phản ứng + Chủ động**:
- **Phản ứng:** Xử lý khiếu nại, vấn đề phát sinh từ phụ huynh/học viên.
- **Chủ động:** Gọi điện định kỳ, theo dõi điểm danh, phát hiện học viên có dấu hiệu bỏ học.
- **Tái phí:** Chiến dịch gia hạn tự động khi gần hết khóa.

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:**
    - `CAP-COM`: Khi tái phí thành công → chuyển sang lập Đơn hàng mới.
*   👈 **Nhận dữ liệu từ:**
    - `CAP-OPS`: Lịch sử điểm danh, điểm số để nhân viên chăm sóc có dữ liệu khi trao đổi với phụ huynh.

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| Phiếu chăm sóc | ✅ | |
| Nhật ký tương tác | ✅ | |
| Phễu tái phí | ✅ | |
| Hồ sơ Học viên | | → `CAP-MDM` |
| Điểm danh / Nhận xét | | → `CAP-OPS` |
| Đơn hàng tái phí | | → `CAP-COM` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-CARE-01` | Chăm sóc & Xử lý khiếu nại | ✅ Chuẩn vàng |
| `BF-CARE-02` | Chiến dịch Tái phí | ✅ Chuẩn vàng |
