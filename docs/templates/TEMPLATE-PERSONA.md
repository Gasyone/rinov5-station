---
id: PERSONA-XXX
title: "[Tên Vai trò]"
type: "Persona"
domain: "Business"
status: "Draft"
tags: [persona, stakeholder]
---

# Persona: [Tên Vai trò]

> **Mã:** `PERSONA-XXX` (XXX = OWNER / BRANCH_MANAGER / SALE / CSM / TEACHER / ...)
> **Loại:** [Người dùng Hằng ngày / Người ra Quyết định / Người chịu Ảnh hưởng]
> **Tham chiếu:** `STAKEHOLDERS.md`

---

## 1. Hồ sơ Tóm tắt (Snapshot)

| Trường | Giá trị |
|--------|---------|
| **Tên gọi mẫu** | [Ví dụ: "Chị Lan — CSM cơ sở Quận 7"] |
| **Vai trò trong tổ chức** | [Chức danh thực tế] |
| **Cấp quản lý** | [Cá nhân / Nhóm / Chi nhánh / Vùng / Toàn hệ thống] |
| **Số lượng dự kiến trong tổ chức** | [N người] |
| **Vai trò trong `useAuthStore`** | `[role string]` (nếu có) |
| **Truy cập chính** | [Web / Mobile / Cả hai] |
| **Tần suất sử dụng** | [Hằng ngày / Vài lần/tuần / Định kỳ] |

---

## 2. Mục tiêu Cá nhân (Personal Goals)

> Persona này muốn đạt được điều gì trong công việc hằng ngày?

1. [Mục tiêu cụ thể, đo được nếu có thể]
2. [Mục tiêu cụ thể]
3. [Mục tiêu cụ thể]

---

## 3. Bài toán Đang Gặp (Pain Points)

> Điều gì khiến công việc của họ khó khăn HÔM NAY?

| # | Vấn đề | Mức độ Ảnh hưởng | Tần suất |
|---|--------|-------------------|----------|
| 1 | [Mô tả vấn đề cụ thể] | [Cao / Trung / Thấp] | [Hằng ngày / Tuần / Tháng] |
| 2 | | | |
| 3 | | | |

---

## 4. Một Ngày Làm Việc Điển Hình (A Day in the Life)

> Mô tả tuyến tính theo thời gian, càng cụ thể càng tốt.

| Khoảng thời gian | Hoạt động | Công cụ đang dùng | Vấn đề gặp phải |
|------------------|-----------|-------------------|-----------------|
| [08:00 — 09:00] | [Hoạt động] | [Công cụ / Hệ thống] | [Nếu có] |
| [09:00 — 11:00] | | | |
| [11:00 — 12:00] | | | |
| [13:30 — 17:00] | | | |
| [Cuối ngày] | | | |

---

## 5. Quyết định Họ Phải Đưa Ra (Decisions)

> Persona này thường xuyên phải đưa ra quyết định nào? Dựa trên thông tin gì?

| Quyết định | Tần suất | Thông tin cần | Hậu quả nếu sai |
|-----------|----------|----------------|------------------|
| [VD: Có gọi học viên này tái phí không?] | [Hằng tuần] | [Lịch sử đóng phí, trạng thái] | [Mất khách / Lãng phí thời gian] |
| | | | |

---

## 6. Năng lực & Hạn chế (Skills & Constraints)

| Hạng mục | Mô tả |
|----------|-------|
| **Trình độ công nghệ** | [Cao / Trung bình / Thấp] |
| **Thiết bị thường dùng** | [Laptop / Mobile / Tablet] |
| **Kết nối mạng** | [Văn phòng ổn định / Đôi khi yếu / Không có] |
| **Ngôn ngữ giao tiếp** | [Tiếng Việt / Anh / Khác] |
| **Hạn chế đặc biệt** | [VD: Phải dùng được khi đi công tác chi nhánh khác] |

---

## 7. Các "Job-To-Be-Done" Cốt lõi (JTBD)

> Theo phương pháp JTBD: persona "thuê" sản phẩm để làm việc gì?

1. **Khi** [bối cảnh], **tôi muốn** [hoạt động], **để** [kết quả mong muốn].
2. **Khi** [bối cảnh], **tôi muốn** [hoạt động], **để** [kết quả mong muốn].
3. **Khi** [bối cảnh], **tôi muốn** [hoạt động], **để** [kết quả mong muốn].

---

## 8. Yêu cầu Phái sinh (Stakeholder Requirements)

> Liên kết tới các SR đã được tạo từ persona này.

| Mã SR | Tiêu đề | Trạng thái |
|-------|---------|-----------|
| `SR-XXX-001-[name]` | [Tên SR] | Draft / Approved |
| `SR-XXX-002-[name]` | | |

---

## 9. Năng lực Hệ thống Liên quan (CAP Mapping)

> Persona này giao tiếp với những Capability nào?

| CAP | Mức độ Tương tác | Tần suất |
|-----|-------------------|----------|
| `CAP-XXX` | [Cao / Trung / Thấp] | [Hằng ngày / Tuần / Tháng] |
| `CAP-YYY` | | |

---

## 10. Câu Trích Dẫn Đặc Trưng (Quote)

> *"[Một câu Persona này thực sự đã nói trong phỏng vấn, hoặc câu thể hiện chính xác tâm tư của họ.]"*

---

## 11. Chỉ dẫn cho AI Agent & Lập trình viên

- **Persona PHẢI dựa trên dữ liệu thực** (phỏng vấn, khảo sát, quan sát) — không suy đoán.
- Khi viết US, tham chiếu Persona bằng mã `PERSONA-XXX`, không viết lại nội dung.
- Mọi tính năng phải khớp với ít nhất 1 JTBD ở mục 7.
- Pain Point ở mục 3 là nguồn nguyên liệu chính để viết Stakeholder Requirements.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** tạo Persona dựa trên cảm nhận. Phải có nguồn dữ liệu (phỏng vấn / quan sát / khảo sát).
- **KHÔNG** gộp 2 vai trò có goals/pain points/quyền khác nhau vào 1 Persona.
- **KHÔNG** thêm chi tiết kỹ thuật (UI mockup, schema) vào Persona — đó là việc của US.
- **KHÔNG** đặt định kiến (giới tính, tuổi, văn hóa) vượt quá mức cần thiết để hiểu hành vi công việc.
