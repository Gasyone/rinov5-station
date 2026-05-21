---
id: QS-PERSONA-VALIDATE
title: "Validate 5 Persona — Xác nhận giả định"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "ALL"
target_output: ["PERSONA-*.md (gỡ ⓪)", "BR mới nếu phát hiện"]
duration: "30 phút / persona"
status: "Active"
tags: [questionnaire, persona, validate]
---

# QS-PERSONA-VALIDATE: Validate 5 Persona

> **Mục tiêu:** Xác nhận hoặc bác bỏ các giả định (⓪) trong 5 file Persona.
> **Persona mục tiêu:** Lần lượt CSM, BM, Sale, Teacher, Owner.
> **Thời lượng:** 30 phút / persona.
> **Output:** Gỡ ⓪ trong Persona, bổ sung data thật, phát hiện BR/SR mới.

---

## 1. Hướng dẫn Người Phỏng vấn

- Mở file `PERSONA-XXX.md` tương ứng trước buổi phỏng vấn.
- Đánh dấu mọi mục có ⓪ — đó là những điểm cần hỏi.
- Ghi kết quả trực tiếp vào bảng bên dưới.
- Sau buổi, lưu vào `RESPONSES/RS-PERSONA-VALIDATE-{ngày}.md`.

---

## 2. Khởi động (5 phút)

| # | Câu hỏi | Đáp án gợi ý | Ghi vào |
|---|---------|--------------|---------|
| W1 | Bạn giữ vai trò gì? Bao lâu rồi? | ○ < 1 năm ○ 1-3 năm ○ > 3 năm | Persona §1 |
| W2 | Bạn dùng thiết bị gì chính khi làm việc? | ○ Laptop ○ Mobile ○ Cả hai | Persona §6 |
| W3 | Mỗi ngày bạn dùng hệ thống (app/phần mềm) bao nhiêu giờ? | ○ < 1h ○ 1-3h ○ 3-5h ○ > 5h | Persona §1 |

---

## 3. Mục tiêu & Pain Points (10 phút)

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| G1 | Mục tiêu quan trọng nhất trong công việc hằng ngày của bạn là gì? | Mở | ___ | Persona §2 |
| G2 | Bạn đo lường thành công bằng chỉ số nào? | Mở | ___ | Persona §2 + KPI |
| P1 | Điều gì khiến bạn mất nhiều thời gian nhất mỗi ngày? | Mở | ___ | Persona §3 |
| P2 | Có việc nào bạn phải làm lặp đi lặp lại mà bạn ước hệ thống tự làm? | Mở | ___ | Persona §3 + SR tiềm năng |
| P3 | Lần gần nhất bạn bực mình với công cụ/hệ thống là khi nào? Vì sao? | Mở | ___ | Persona §3 + BR tiềm năng |
| P4 | Xếp hạng 3 vấn đề lớn nhất (1=lớn nhất): | Xếp hạng | 1.___ 2.___ 3.___ | Persona §3 priority |

---

## 4. Một Ngày Làm Việc (10 phút)

| # | Câu hỏi | Loại | Ghi vào |
|---|---------|------|---------|
| D1 | Mô tả cho tôi nghe 1 ngày làm việc bình thường, từ lúc bắt đầu đến kết thúc? | Mở (kể chuyện) | Persona §4 |
| D2 | Buổi sáng bạn mở app/hệ thống đầu tiên để làm gì? | Mở | Persona §4 + JTBD |
| D3 | Có khoảng thời gian nào trong ngày bạn KHÔNG dùng hệ thống? Vì sao? | Mở | Persona §4 + §6 |
| D4 | Bạn phải đưa ra quyết định gì hằng ngày? Dựa trên thông tin nào? | Mở | Persona §5 |
| D5 | Khi cần thông tin mà hệ thống không có, bạn hỏi ai / tìm ở đâu? | Mở | Gap → SR tiềm năng |

---

## 5. Xác nhận Giả định ⓪ (5 phút)

> Mở file Persona tương ứng, đọc từng mục có ⓪, hỏi xác nhận.

| # | Giả định (trích từ Persona) | Câu hỏi xác nhận | Kết quả |
|---|----------------------------|-------------------|---------|
| V1 | ⓪ "Mất 30p mỗi sáng chỉ để biết ai báo nghỉ" (BM) | Đúng không? Thực tế mất bao lâu? | ○ Đúng ○ Sai → thực tế: ___ |
| V2 | ⓪ "Không có cảnh báo GV chưa confirm điểm danh" (BM) | Hiện tại bạn biết GV chưa điểm danh bằng cách nào? | ___ |
| V3 | ⓪ "Phải mở 4-5 màn hình mỗi sáng" (CSM) | Bạn mở bao nhiêu tab/màn hình khi bắt đầu ca? | ○ 1-2 ○ 3-4 ○ 5+ |
| V4 | ⓪ "30-40 cuộc gọi/ngày" (CSM) | Trung bình bạn gọi bao nhiêu cuộc/ngày? | ___ cuộc |
| V5 | ⓪ "Mỗi cuộc cần ≤ 30s mở context HV" (CSM) | Hiện tại mất bao lâu để mở thông tin HV trước khi gọi? | ○ < 30s ○ 30s-1p ○ 1-3p ○ > 3p |
| V6 | ⓪ "Pipeline lead quá nhiều, quên follow-up" (Sale) | Bạn có bao nhiêu lead đang theo dõi? Có quên không? | ___ lead, ○ Có quên ○ Không |
| V7 | ⓪ "Form điểm danh dài 3 trang" (Teacher) | Hiện tại điểm danh mất bao lâu? Trên thiết bị gì? | ___ phút, ○ Laptop ○ Mobile ○ Giấy |
| V8 | ⓪ "Chỉ cần 30 giây xem báo cáo" (Owner) | Bạn dành bao lâu xem báo cáo mỗi sáng? | ○ < 1p ○ 1-5p ○ 5-15p ○ > 15p |

---

## 6. Kết thúc (2 phút)

| # | Câu hỏi | Ghi vào |
|---|---------|---------|
| E1 | Có điều gì tôi chưa hỏi mà bạn muốn chia sẻ? | Ghi chú tự do |
| E2 | Nếu hệ thống mới chỉ giải quyết được 1 vấn đề, bạn chọn vấn đề nào? | SR ưu tiên cao nhất |

---

## 7. Output Mapping

| Nhóm câu hỏi | Kết quả → File | Mục |
|---------------|----------------|-----|
| W1-W3 | PERSONA-*.md | §1 Snapshot + §6 Skills |
| G1-G2 | PERSONA-*.md | §2 Goals |
| P1-P4 | PERSONA-*.md + BR tiềm năng | §3 Pain Points |
| D1-D5 | PERSONA-*.md | §4 A Day in the Life + §5 Decisions |
| V1-V8 | PERSONA-*.md (gỡ ⓪) | Trực tiếp tại mục gốc |
| E1-E2 | SR tiềm năng | Tạo mới nếu phát hiện |
