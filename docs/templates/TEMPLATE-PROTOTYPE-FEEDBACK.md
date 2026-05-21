---
id: TPL-PROTO
title: "Prototyping Feedback — Thu Feedback trên Mockup"
type: "Prototype Feedback Template"
domain: "Elicitation"
status: "Active"
tags: [template, prototype, feedback, usability, elicitation, babok]
---

# TPL-PROTO: Prototyping Feedback — Thu Feedback trên Mockup

> **Kỹ thuật BABOK:** Prototyping / Interface Analysis
> **Mục đích:** Thu thập phản hồi từ người dùng thực tế khi tương tác với mockup/prototype.
> **Khi nào dùng:** Sau khi có wireframe hoặc prototype, trước khi code chính thức.

---

## 1. Thông tin Buổi Test

| Mục | Giá trị |
|-----|---------|
| **Màn hình / Prototype** | [VD: Màn hình Danh sách Học viên v2] |
| **Link Prototype** | [Figma/InVision URL] |
| **Persona test** | `PERSONA-XXX` |
| **Người test** | ___ |
| **Ngày test** | YYYY-MM-DD |
| **Facilitator** | ___ |
| **Thời lượng** | ___ phút (khuyến nghị 20-30 phút/người) |

---

## 2. Hướng dẫn Facilitator

- Giới thiệu: "Chúng tôi đang test thiết kế, KHÔNG phải test bạn."
- Không gợi ý cách thao tác — để người test tự khám phá.
- Khuyến khích "Think Aloud" — nói ra suy nghĩ khi thao tác.
- Ghi chép hành vi, KHÔNG chỉ lời nói.
- Nếu người test bị kẹt > 30 giây, ghi nhận rồi gợi ý nhẹ.
- Lưu kết quả vào `ELICITATION/RESPONSES/RS-PROTO-{Screen}-{ngày}.md`.

---

## 3. Kịch bản Test (Tasks)

> Mỗi task là 1 hành động cụ thể người test cần hoàn thành trên prototype.

| Task | Mô tả | Tiêu chí thành công |
|------|--------|---------------------|
| Task 1 | [VD: Tìm học viên tên "Nguyễn Văn A"] | Tìm được trong < 15 giây |
| Task 2 | [VD: Tạo đơn hàng mới cho học viên] | Hoàn thành không cần hỏi |
| Task 3 | [VD: Xem lịch sử thanh toán] | Navigate đúng tab |
| Task 4 | [VD: Xuất báo cáo tháng] | Tìm được nút Export |
| Task 5 | [VD: Đổi trạng thái học viên sang "Bảo lưu"] | Thao tác đúng flow |

---

## 4. Bảng Ghi nhận Kết quả

| Task | Hoàn thành? | Thời gian | Lỗi gặp | Nhận xét người test | Mức hài lòng (1-5) |
|------|-------------|-----------|----------|---------------------|---------------------|
| Task 1 | ○ Có ○ Không ○ Một phần | ___ giây | | | ○1 ○2 ○3 ○4 ○5 |
| Task 2 | ○ Có ○ Không ○ Một phần | ___ giây | | | ○1 ○2 ○3 ○4 ○5 |
| Task 3 | ○ Có ○ Không ○ Một phần | ___ giây | | | ○1 ○2 ○3 ○4 ○5 |
| Task 4 | ○ Có ○ Không ○ Một phần | ___ giây | | | ○1 ○2 ○3 ○4 ○5 |
| Task 5 | ○ Có ○ Không ○ Một phần | ___ giây | | | ○1 ○2 ○3 ○4 ○5 |

---

## 5. SUS Score (System Usability Scale) — Tùy chọn

> Dùng khi cần đo lường định lượng. Cho người test đánh giá 10 câu (thang 1-5).

| # | Câu hỏi SUS | Điểm (1-5) |
|---|-------------|------------|
| 1 | Tôi muốn sử dụng hệ thống này thường xuyên | ○1 ○2 ○3 ○4 ○5 |
| 2 | Tôi thấy hệ thống phức tạp không cần thiết | ○1 ○2 ○3 ○4 ○5 |
| 3 | Tôi thấy hệ thống dễ sử dụng | ○1 ○2 ○3 ○4 ○5 |
| 4 | Tôi cần hỗ trợ kỹ thuật để dùng hệ thống | ○1 ○2 ○3 ○4 ○5 |
| 5 | Các chức năng được tích hợp tốt | ○1 ○2 ○3 ○4 ○5 |
| 6 | Có quá nhiều sự không nhất quán | ○1 ○2 ○3 ○4 ○5 |
| 7 | Hầu hết mọi người sẽ học dùng nhanh | ○1 ○2 ○3 ○4 ○5 |
| 8 | Hệ thống rất cồng kềnh khi sử dụng | ○1 ○2 ○3 ○4 ○5 |
| 9 | Tôi cảm thấy tự tin khi sử dụng | ○1 ○2 ○3 ○4 ○5 |
| 10 | Tôi cần học nhiều thứ trước khi dùng được | ○1 ○2 ○3 ○4 ○5 |

**SUS Score = ___** (Tính theo công thức chuẩn, thang 0-100. > 68 = trên trung bình)

---

## 6. Tổng hợp Phát hiện

| # | Phát hiện | Mức độ | Đề xuất cải thiện |
|---|-----------|--------|-------------------|
| 1 | | ○ Critical ○ Major ○ Minor | |
| 2 | | ○ Critical ○ Major ○ Minor | |
| 3 | | ○ Critical ○ Major ○ Minor | |

---

## 7. Output Mapping

| Kết quả | → Điền vào file | Mục cụ thể |
|---------|-----------------|------------|
| Task thất bại | `US-XXX.md` | Cập nhật AC / UX flow |
| Lỗi navigation | Design System | §4 Navigation Pattern |
| Feedback tích cực | `US-XXX.md` | Validate thiết kế hiện tại |
| SUS Score | Project metrics | Baseline usability |
| Đề xuất cải thiện | `SR-XXX.md` hoặc Backlog | Yêu cầu UX mới |

---

## 8. Guardrails (Hàng rào An toàn)

- **KHÔNG** test quá 5 task/người — gây mệt mỏi, kết quả sai lệch.
- **KHÔNG** giải thích cách dùng trước khi test — đo khả năng tự khám phá.
- **KHÔNG** dùng đồng nghiệp nội bộ làm người test — cần người dùng thực tế.
- **Số lượng tối thiểu:** 5 người/persona để phát hiện 85% vấn đề usability.
- **Prototype fidelity:** Ghi rõ mức độ (Low-fi wireframe / Mid-fi mockup / Hi-fi interactive).
- **Bias cần tránh:** Confirmation bias — không chỉ hỏi "có thích không?" mà đo hành vi thực.
