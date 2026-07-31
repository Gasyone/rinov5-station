---
id: SR-TEACHER-002
title: "Báo nghỉ và đề xuất giáo viên dạy thế"
type: "Stakeholder Requirement"
domain: "Business"
persona: "PERSONA-TEACHER"
parent_br: "BR-002"
status: "Draft"
priority: "High"
tags: [sr, teacher, operations, substitute]
---

# SR-TEACHER-002: Báo nghỉ và đề xuất giáo viên dạy thế

> **Persona:** `PERSONA-TEACHER`
> **BR cha:** `BR-002`
> **Tham chiếu:** `PERSONAS/PERSONA-TEACHER.md` (yêu cầu báo nghỉ) + `QS-OPS-04` mục câu hỏi cho Teacher.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> **Là** Giáo viên giảng dạy,
> **tôi cần** một công cụ để đăng ký báo nghỉ đột xuất cho buổi học lẻ trực tiếp trên hệ thống và có quyền tự đề xuất giáo viên giảng dạy thay thế từ danh sách đồng nghiệp rảnh lịch,
> **để** giảm tải việc liên lạc thủ công qua các nhóm chat với BM và giúp BM tìm kiếm nhân sự thay thế nhanh chóng hơn.

---

## 2. Bối cảnh Sử dụng (Usage Context)

| Trường | Giá trị |
|--------|---------|
| **Khi nào cần?** | Khi giáo viên có sự cố bất khả kháng không thể đứng lớp giảng dạy buổi học đó |
| **Tần suất** | Hiếm khi (từ 1–2 lần/tháng hoặc đột xuất) |
| **Thiết bị** | Web hoặc Thiết bị di động |
| **Mức độ khẩn** | Khẩn cấp |
| **Liên kết JTBD** | Gửi yêu cầu nghỉ phép và thông báo sự cố buổi học |

---

## 3. Pain Point Đang Giải quyết

| Pain Point Persona | Mức độ Giải quyết |
|--------------------|---------------------|
| Giáo viên phải liên hệ trực tiếp BM qua kênh chat ngoài, chờ BM tìm người thay thế thủ công | Đầy đủ |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

| # | Tiêu chí | Cách đo | Kết quả mong đợi |
|---|----------|---------|-------------------|
| SR-AC-01 | Cho phép giáo viên chọn buổi học sắp diễn ra và tạo phiếu báo nghỉ | Thực hiện tạo phiếu | Phiếu được tạo thành công |
| SR-AC-02 | Hiển thị danh sách giáo viên có thể dạy thay (cùng trường, rảnh lịch) để giáo viên lựa chọn đề cử dạy thay | Đọc dữ liệu gợi ý | Hiển thị danh sách đúng điều kiện |
| SR-AC-03 | Gửi thông báo đến tài khoản của BM ngay khi giáo viên gửi phiếu báo nghỉ | Kiểm tra thông báo BM | BM nhận được thông báo ngay lập tức |

---

## 5. Ràng buộc Phi chức năng

| Khía cạnh | Yêu cầu |
|-----------|---------|
| **Bảo mật** | Tuân thủ chính sách khoanh vùng dữ liệu trường học, chỉ hiển thị danh sách giáo viên cùng cơ sở trường để đề cử (`[POLICY-ORG-01]`) |
| **Tính khả dụng** | Giao diện phải thân thiện khi thao tác trên thiết bị di động |

---

## 6. Mức độ Ưu tiên (Priority — MoSCoW)

| Mức | Đánh dấu | Lý do |
|-----|----------|-------|
| **M**ust have | — | Giáo viên báo nghỉ và BM phê duyệt |
| **S**hould have | ✓ | Cho phép giáo viên tự đề cử nhân sự thay thế giúp BM rút ngắn thời gian xử lý |
| **C**ould have | — | |
| **W**on't have (this release) | — | Tích hợp hệ thống tự động đổi ca và tự đối soát tiền lương dạy thay tự động |

---

## 7. User Stories Phái sinh (US Children)

| Mã US | Tiêu đề | Loại | Trạng thái |
|-------|---------|------|------------|
| `US-OPS03-01` | Đề xuất & Gán giáo viên dạy thay | Form/Biểu mẫu | Draft |

---

## 8. Quan hệ Trace

| Tầng | Mã |
|------|----|
| Persona | `PERSONA-TEACHER` |
| BR | `BR-002` |
| CAP | `CAP-OPS` |
| BF | `BF-OPS-03` |
| Screen | `calendar_class_schedule` |

---

## 9. Phụ thuộc & Xung đột

### 9.1. Phụ thuộc
- `BF-HR-02`: Đăng ký lịch làm việc và quỹ thời gian giáo viên.

### 9.2. Xung đột
- Không có.

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người | Trạng thái |
|-----------|------|-------|-----------|
| v0.1 | 2026-06-23 | (AI Agent) | Draft |
