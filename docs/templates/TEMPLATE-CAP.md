---
id: "CAP-XXX"
title: "[Tên Khối Năng Lực]"
type: "Capability"
domain: "CAP-XXX"
parent_br: "BR-XXX"   # hoặc "TBD-NEEDS-BR" nếu chưa có BR cha — phải hiển thị gap, không che giấu
status: "Draft"
tags: [capability]
---

# Capability: [Tên Khối Năng Lực] (Tiếng Việt)

**ID:** `CAP-XXX`  
**Domain:** [Tên Domain]  
**Phân loại:** [Năng lực Cốt lõi / Năng lực Hỗ trợ / Năng lực Quản trị]
**BR cha:** `BR-XXX` (xem `00-business/BR/`)

---

## Lịch sử cập nhật tài liệu (Changelog)

| Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật |
|---|---|---|
| [Ngày/Tháng/Năm] | [Tóm tắt nội dung] | [Lý do cập nhật] |

---

## 1. Mục tiêu & Phạm vi

[Mô tả ngắn gọn mục tiêu của khối năng lực này. Nó sinh ra để giải quyết bài toán gì cho tổ chức? Phạm vi quản lý của nó đến đâu?]

## 2. Thực thể Dữ liệu cốt lõi

*   **[Thực thể 1]:** [Mô tả vai trò của thực thể này trong nghiệp vụ]
*   **[Thực thể 2]:** [Mô tả vai trò của thực thể này trong nghiệp vụ]

## 3. Tuân thủ Quy định & Tiêu chuẩn (Compliance)

Khối năng lực này tuân thủ các tiêu chuẩn vận hành nghiệp vụ:
1. **Tuân thủ [Quy định A]:** [Mô tả ngắn gọn cách áp dụng quy định này]
2. **Tuân thủ [Quy định B]:** [Mô tả ngắn gọn]

## 4. Kiến trúc & Nguyên tắc cốt lõi

[Trình bày sơ đồ hoặc diễn giải các nguyên tắc thiết kế quan trọng nhất định hình nên kiến trúc. Ví dụ: Sự tách biệt giữa A và B, Quy trình vòng đời...]

## 5. Giao tiếp Liên miền (Cross-Capability Interactions)

*   👉 **Cung cấp dữ liệu cho:** [Liệt kê các Khối năng lực khác phụ thuộc vào khối này]
*   👈 **Nhận dữ liệu từ:** [Liệt kê các Khối năng lực mà khối này cần lấy dữ liệu]

## 6. Phân ranh giới Sở hữu Dữ liệu

| Dữ liệu | Khối này sở hữu | Thuộc khối khác |
|----------|-----------------|-----------------|
| [Trường thông tin A] | ✅ | |
| [Trường thông tin B] | | → `CAP-YYY` |

## 7. Danh sách Phân hệ Nghiệp vụ (Business Functions)

| Mã BF | Tên Phân hệ Nghiệp vụ | Trạng thái |
|-------|------------------------|------------|
| `BF-XXX-01` | [Tên BF 1] | Đang soạn thảo |
| `BF-XXX-02` | [Tên BF 2] | Đang soạn thảo |
