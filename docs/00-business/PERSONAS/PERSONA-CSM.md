---
id: PERSONA-CSM
title: "Chăm sóc Học viên (CSM)"
type: "Persona"
domain: "Business"
status: "Draft-NeedsValidation"
tags: [persona, stakeholder, csm, daily-user, retention]
---

# Persona: Chăm sóc Học viên (Customer Success Manager)

> **Mã:** `PERSONA-CSM`
> **Loại:** Người dùng Hằng ngày — Power User
> **Tham chiếu:** [STAKEHOLDERS.md](../STAKEHOLDERS.md)
>
> ⚠️ **Trạng thái dữ liệu:** Phần `⓪` cần CSM thật xác nhận.

---

## 1. Hồ sơ Tóm tắt (Snapshot)

| Trường | Giá trị |
|--------|---------|
| **Tên gọi mẫu** | "Chị Lan — CSM cơ sở Quận 7" |
| **Vai trò trong tổ chức** | Chăm sóc học viên / Retention specialist |
| **Cấp quản lý** | Cá nhân (báo cáo BM) |
| **Số lượng dự kiến trong tổ chức** | 1–3 CSM / cơ sở (tùy quy mô) |
| **Vai trò trong `useAuthStore`** | `csm` |
| **Truy cập chính** | Web là chính (xử lý ticket, gọi điện) |
| **Tần suất sử dụng** | Hằng ngày, gần như liên tục |

---

## 2. Mục tiêu Cá nhân (Personal Goals)

1. ⓪ Đạt KPI tỷ lệ tái phí của HV được phân công.
2. Phát hiện sớm HV có dấu hiệu nghỉ học để can thiệp kịp thời (`BF-CARE-01` — at-risk).
3. Đảm bảo mọi ticket / khiếu nại được xử lý trong SLA cam kết.
4. ⓪ Theo dõi HV "sắp hết hạn" và biến thành đơn tái phí (`BF-CARE-02`).

---

## 3. Bài toán Đang Gặp (Pain Points)

| # | Vấn đề | Mức độ Ảnh hưởng | Tần suất |
|---|--------|-------------------|----------|
| 1 | Số lượng HV phân công quá nhiều — không biết bắt đầu từ đâu mỗi sáng | Cao | Hằng ngày |
| 2 | Phụ huynh gọi đến mà CSM không có lịch sử cuộc gọi trước → kém chuyên nghiệp | Cao | Hằng ngày |
| 3 | HV "im lặng" rồi đột ngột không tái phí → CSM không có dấu hiệu sớm để can thiệp | Cao | Hằng tháng |
| 4 | ⓪ Phải tổng hợp ticket đã đóng cuối tuần báo cáo BM | Trung | Hằng tuần |
| 5 | ⓪ Khi HV chuyển GV chủ nhiệm, CSM không được thông báo → mất context | Trung | Hằng tháng |

---

## 4. Một Ngày Làm Việc Điển Hình (A Day in the Life)

| Khoảng thời gian | Hoạt động | Công cụ | Vấn đề |
|------------------|-----------|---------|--------|
| 08:00 – 09:00 | Mở danh sách "Hôm nay" — HV cần gọi: at-risk, sắp hết hạn, mới mua, không vào học (`group_care`) | Rinov5 | ⓪ Phải mở 4–5 màn hình rời rạc thay vì 1 inbox |
| 09:00 – 11:00 | Gọi điện chăm sóc — log ticket sau mỗi cuộc (`BF-CARE-01`) | Rinov5 + điện thoại | Tạo ticket thủ công, không gắn được vào HV nhanh |
| 11:00 – 12:00 | Xử lý ticket phụ huynh gửi (đổi lớp, đổi GV, complaint) | Rinov5 | Phải mở profile HV ở tab khác |
| 13:30 – 15:00 | Theo dõi HV "im lặng" — gọi 5–7 cuộc, kiểm tra điểm danh tuần qua (`US-CLS03-05`) | Rinov5 | Chưa có cảnh báo "HV vắng 3 buổi liên tiếp" |
| 15:00 – 16:30 | Đẩy chiến dịch tái phí cho HV sắp hết hạn (`BF-CARE-02`) | Rinov5 | Không có template tin nhắn / email gắn sẵn |
| 16:30 – 17:30 | Cập nhật trạng thái ticket, lên kế hoạch ngày mai | Rinov5 | — |

---

## 5. Quyết định Họ Phải Đưa Ra (Decisions)

| Quyết định | Tần suất | Thông tin cần | Hậu quả nếu sai |
|-----------|----------|----------------|------------------|
| Có gọi HV này tái phí không, gọi khi nào | Hằng tuần | Lịch sử đóng phí, trạng thái lớp, điểm danh | Mất khách hoặc lãng phí thời gian |
| Có escalate ticket này lên BM không | Hằng ngày | Mức độ vấn đề, lịch sử khiếu nại | Khách bức xúc nếu xử lý chậm |
| Đề xuất chuyển lớp / chuyển GV cho HV | Hằng tuần | Lý do của HV, năng lực HV, lớp khả dụng | Phụ huynh không hài lòng |
| ⓪ Có gửi ưu đãi đặc biệt (giảm phí tái) không | Hằng tuần | Profile HV, lịch sử đóng phí, chính sách | Lỗ margin hoặc mất khách |

---

## 6. Năng lực & Hạn chế (Skills & Constraints)

| Hạng mục | Mô tả |
|----------|-------|
| **Trình độ công nghệ** | Trung bình. Quen tools chăm sóc khách. Không cần training nâng cao. |
| **Thiết bị thường dùng** | Laptop văn phòng |
| **Kết nối mạng** | Wifi cơ sở ổn định |
| **Ngôn ngữ giao tiếp** | Tiếng Việt — kỹ năng giao tiếp + đồng cảm là chính |
| **Hạn chế đặc biệt** | Một ngày 30–40 cuộc gọi → mỗi cuộc cần ≤ 30 giây để mở context HV |

---

## 7. Các "Job-To-Be-Done" Cốt lõi (JTBD)

1. **Khi** vào ca làm sáng, **tôi muốn** thấy 1 inbox duy nhất gộp tất cả "việc cần làm hôm nay" (HV at-risk, HV sắp hết hạn, HV vắng 3 buổi, ticket SLA gần hết), **để** không phải mở 5 màn hình tự nhặt việc.
2. **Khi** phụ huynh gọi đến, **tôi muốn** mở profile HV thấy ngay lịch sử cuộc gọi cuối, ticket gần nhất, trạng thái lớp, **để** nói chuyện đúng ngữ cảnh.
3. **Khi** xác định HV at-risk, **tôi muốn** lý do được hệ thống gợi ý (vắng N buổi, điểm thấp, complaint gần đây), **để** chuẩn bị nội dung gọi điện hiệu quả.
4. **Khi** đẩy chiến dịch tái phí, **tôi muốn** có template tin nhắn / email theo loại HV, **để** không phải gõ tay từng người.
5. **Khi** đóng ticket, **tôi muốn** ghi nhanh outcome (gọi được / không nghe / hứa quay lại / từ chối) trong < 5 giây, **để** không bị tồn ticket.

---

## 8. Yêu cầu Phái sinh (Stakeholder Requirements)

| Mã SR | Tiêu đề | Trạng thái |
|-------|---------|-----------|
| `SR-CSM-001-inbox-hom-nay` | Inbox "Hôm nay" duy nhất (chưa tạo) | ⏳ |
| `SR-CSM-002-pipeline-tai-phi` | Pipeline tái phí (chưa tạo — sẽ là Pilot 4) | ⏳ |
| `SR-CSM-003-canh-bao-at-risk-tu-dong` | Cảnh báo at-risk tự động (chưa tạo) | ⏳ |

---

## 9. Năng lực Hệ thống Liên quan (CAP Mapping)

| CAP | Mức độ Tương tác | Quyền (RBAC) | Phạm vi (ABAC) | Tần suất |
|-----|-------------------|--------------|----------------|----------|
| `CAP-CARE` | Cao | View, Create ticket, Update | HV phân công + cơ sở | Hằng ngày |
| `CAP-OPS` | Cao | View | HV phân công + cơ sở | Hằng ngày |
| `CAP-MDM` | Cao | View, Update contact | Person/Family liên quan | Hằng ngày |
| `CAP-COM` | Trung | View đơn, Create đơn tái phí | HV phân công | Hằng tuần |
| `CAP-RPT` | Trung | View | Cá nhân + cơ sở | Hằng tuần |
| `CAP-FIN` | Thấp | View | Phiếu thu HV | Khi phụ huynh hỏi |

---

## 10. Câu Trích Dẫn Đặc Trưng (Quote)

> *"⓪ Tôi cần biết HÔM NAY ai cần gọi, không phải mỗi sáng tự đoán. Hệ thống phải biết trước tôi."*
