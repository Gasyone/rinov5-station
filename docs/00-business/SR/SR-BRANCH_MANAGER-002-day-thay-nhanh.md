---
id: SR-BRANCH_MANAGER-002
title: "Quy trình dạy thay nhanh dưới 10 phút"
type: "Stakeholder Requirement"
domain: "Business"
persona: "PERSONA-BRANCH_MANAGER"
parent_br: "BR-002"
status: "Draft"
priority: "High"
tags: [sr, branch-manager, operations, substitute]
---

# SR-BRANCH_MANAGER-002: Quy trình dạy thay nhanh dưới 10 phút

> **Persona:** `PERSONA-BRANCH_MANAGER`
> **BR cha:** `BR-002`
> **Tham chiếu:** `PERSONAS/PERSONA-BRANCH-MANAGER.md` Pain Point #2 + JTBD #1.

---

## 1. Phát biểu Yêu cầu (Requirement Statement)

> **Là** Branch Manager,
> **tôi cần** một công cụ tìm kiếm và phân công giáo viên dạy thay tự động gợi ý danh sách giáo viên khả dụng dựa trên môn học, trình độ lớp và lịch rảnh trong cùng một cơ sở trường,
> **để** tôi có thể hoàn tất việc bố trí giáo viên dạy thế cho lớp học bị sự cố trong vòng dưới 10 phút, tránh lớp bị trống hoặc gián đoạn lịch học.

---

## 2. Bối cảnh Sử dụng (Usage Context)

| Trường | Giá trị |
|--------|---------|
| **Khi nào cần?** | Khi giáo viên báo nghỉ đột xuất (do ốm đau, việc bận bất khả kháng) hoặc khi có sự thay đổi nhân sự từ trước |
| **Tần suất** | Hằng tuần (từ 1–3 lần/tuần) |
| **Thiết bị** | Web (laptop văn phòng) |
| **Mức độ khẩn** | Rất khẩn (cần xử lý ngay lập tức khi phát sinh báo nghỉ) |
| **Liên kết JTBD** | `PERSONA-BRANCH_MANAGER` mục 7 — JTBD #1 (dạy thay nhanh) |

---

## 3. Pain Point Đang Giải quyết

| Pain Point Persona | Mức độ Giải quyết |
|--------------------|---------------------|
| `PERSONA-BRANCH_MANAGER` Pain Point #2: "Giáo viên báo nghỉ đột xuất → phải tự tay tìm GV thay" | Đầy đủ |

---

## 4. Tiêu chí Chấp nhận (Acceptance Criteria)

| # | Tiêu chí | Cách đo | Kết quả mong đợi |
|---|----------|---------|-------------------|
| SR-AC-01 | Tự động hiển thị danh sách giáo viên dạy thay phù hợp khi bấm "Dạy thay" trên bảng nổi thông tin buổi học | Thực hiện bấm nút trên màn hình | Hiển thị tối thiểu danh sách gợi ý |
| SR-AC-02 | Gợi ý giáo viên phải đáp ứng: cùng môn dạy của buổi học, cùng trường, và có lịch trống ca đó | Đối chiếu dữ liệu | Khớp 100% |
| SR-AC-03 | Chặn hiển thị các giáo viên đang bị trùng lịch dạy ở bất kỳ lớp học nào khác trong ca đó | Đối chiếu lịch dạy | 0 trùng lịch |
| SR-AC-04 | Hành động gán giáo viên dạy thay yêu cầu hộp thoại xác nhận đồng ý | Thực hiện thao tác gán | Có hiển thị hộp thoại xác nhận |
| SR-AC-05 | Thời gian tìm kiếm và gán giáo viên thành công dưới 10 phút | Đo lường thời gian thực hiện của BM | Hoàn thành ≤ 10 phút |

---

## 5. Ràng buộc Phi chức năng

| Khía cạnh | Yêu cầu |
|-----------|---------|
| **Hiệu năng** | Thời gian quét danh sách giáo viên khả dụng và gợi ý ≤ 2 giây |
| **Bảo mật** | Tuân thủ chính sách khoanh vùng dữ liệu trường học, chỉ hiển thị giáo viên thuộc trường của BM (`[POLICY-ORG-01]`) |
| **Khả dụng** | Khả dụng liên tục khi BM thao tác xử lý lịch trên hệ thống |

---

## 6. Mức độ Ưu tiên (Priority — MoSCoW)

| Mức | Đánh dấu | Lý do |
|-----|----------|-------|
| **M**ust have | ✓ | Là nhu cầu thiết yếu hàng đầu để vận hành trường học không gián đoạn |
| **S**hould have | — | |
| **C**ould have | — | |
| **W**on't have (this release) | — | Tự động nhắn tin mời dạy thay và tự động duyệt khi giáo viên bấm đồng ý trên điện thoại |

---

## 7. User Stories Phái sinh (US Children)

| Mã US | Tiêu đề | Loại | Trạng thái |
|-------|---------|------|------------|
| `US-OPS03-01` | Đề xuất & Gán giáo viên dạy thay | Form/Biểu mẫu | Draft |

---

## 8. Quan hệ Trace

| Tầng | Mã |
|------|----|
| Persona | `PERSONA-BRANCH_MANAGER` |
| BR | `BR-002` |
| CAP | `CAP-OPS` |
| BF | `BF-OPS-03` |
| Screen | `calendar_class_schedule` |

---

## 9. Phụ thuộc & Xung đột

### 9.1. Phụ thuộc
- `BF-HR-02`: Dữ liệu lịch rảnh và quỹ thời gian đã được giáo viên đăng ký từ trước.

### 9.2. Xung đột
- Không có xung đột nghiệp vụ trực tiếp.

---

## 10. Lịch sử Phê duyệt

| Phiên bản | Ngày | Người | Trạng thái |
|-----------|------|-------|-----------|
| v0.1 | 2026-06-23 | (AI Agent) | Draft |
