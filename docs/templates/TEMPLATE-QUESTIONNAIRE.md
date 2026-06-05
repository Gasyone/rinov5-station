---
id: QS-XXX
title: "[Tên Bộ Câu hỏi]"
type: "Questionnaire"
domain: "Elicitation"
target_persona: "PERSONA-XXX"
target_output: ["PERSONA-XXX mục N", "BR-YYY mục Z"]
duration: "30 phút"
status: "Draft"
tags: [questionnaire, elicitation]
---

# QS-XXX: [Tên Bộ Câu hỏi]

> **Mục tiêu:** [Phỏng vấn ai, để xác nhận/khám phá điều gì]
> **Persona mục tiêu:** `PERSONA-XXX`
> **Thời lượng dự kiến:** [15 / 30 / 60] phút
> **Output sẽ điền vào:** [Liệt kê file + mục cụ thể]

---

## 1. Hướng dẫn Người Phỏng vấn

- Đọc trước file Persona tương ứng để hiểu bối cảnh.
- Ghi âm (nếu được phép) hoặc ghi chú real-time.
- Không dẫn dắt câu trả lời — để người được hỏi tự mô tả.
- Đánh dấu `[⓪ Confirmed]` hoặc `[⓪ Rejected]` bên cạnh mỗi giả định.
- Sau phỏng vấn, lưu kết quả vào `ELICITATION/RESPONSES/RS-{QS-ID}-{ngày}.md`.

---

## 2. Câu hỏi Khởi động (Warm-up) — 5 phút

> Mục đích: Tạo không khí thoải mái, xác nhận thông tin cơ bản.

| # | Câu hỏi | Đáp án gợi ý | Ghi vào |
|---|---------|--------------|---------|
| W1 | Bạn đang giữ vai trò gì tại cơ sở? | ○ BM ○ CSM ○ Sale ○ GV ○ Khác: ___ | Persona §1 |
| W2 | Bạn đã làm ở vị trí này bao lâu? | ○ < 6 tháng ○ 6-12 tháng ○ 1-3 năm ○ > 3 năm | Persona §1 |
| W3 | Một ngày làm việc bình thường bạn bắt đầu lúc mấy giờ? | ___ giờ | Persona §4 |

---

## 3. Câu hỏi Chính (Core) — [X] phút

> Mục đích: [Mô tả mục đích cụ thể của phần này]

### Nhóm A: [Tên nhóm câu hỏi]

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| A1 | [Câu hỏi] | Chọn 1 | ○ Đáp án 1 ○ Đáp án 2 ○ Đáp án 3 ○ Khác: ___ | [File §Mục] |
| A2 | [Câu hỏi] | Chọn nhiều | ☐ Đáp án 1 ☐ Đáp án 2 ☐ Đáp án 3 | [File §Mục] |
| A3 | [Câu hỏi] | Thang điểm | 1 ○ 2 ○ 3 ○ 4 ○ 5 (1=Không bao giờ, 5=Hằng ngày) | [File §Mục] |
| A4 | [Câu hỏi] | Mở | ___ (ghi tự do) | [File §Mục] |
| A5 | [Câu hỏi] | Có/Không | ○ Có ○ Không → Nếu Có, hỏi tiếp A5a | [File §Mục] |

### Nhóm B: [Tên nhóm câu hỏi]

| # | Câu hỏi | Loại | Đáp án gợi ý | Ghi vào |
|---|---------|------|--------------|---------|
| B1 | | | | |

---

## 4. Câu hỏi Đào sâu (Deep-dive) — [X] phút

> Mục đích: Khai thác pain point và JTBD cụ thể.

| # | Câu hỏi | Loại | Ghi vào |
|---|---------|------|---------|
| D1 | Điều gì khiến bạn mất nhiều thời gian nhất trong ngày? | Mở | Persona §3 Pain Points |
| D2 | Nếu có 1 phép màu thay đổi 1 thứ trong công việc, bạn chọn gì? | Mở | SR tiềm năng |
| D3 | Lần gần nhất bạn gặp vấn đề với hệ thống là khi nào? Mô tả? | Mở | BR tiềm năng |

---

## 5. Câu hỏi Xác nhận Giả định (Validate ⓪) — [X] phút

> Mục đích: Xác nhận hoặc bác bỏ các giả định đã ghi trong Persona/BR/SR.

| # | Giả định cần xác nhận | Nguồn | Câu hỏi | Kết quả |
|---|------------------------|-------|---------|---------|
| V1 | [Trích giả định ⓪ từ Persona/BR] | [File §Mục] | [Câu hỏi xác nhận] | ○ Đúng ○ Sai ○ Một phần: ___ |
| V2 | | | | |

---

## 6. Kết thúc (Wrap-up) — 3 phút

| # | Câu hỏi | Ghi vào |
|---|---------|---------|
| E1 | Có điều gì bạn muốn bổ sung mà tôi chưa hỏi? | Ghi chú tự do |
| E2 | Bạn có sẵn sàng tham gia 1 buổi review kết quả sau 1 tuần? | ○ Có ○ Không |

---

## 7. Output Mapping (Sau phỏng vấn)

> Người phỏng vấn dùng bảng này để biết kết quả điền vào đâu.

| Câu hỏi | Kết quả → Điền vào file | Mục cụ thể |
|---------|-------------------------|------------|
| W1-W3 | `PERSONA-XXX.md` | §1 Snapshot |
| A1-A5 | `PERSONA-XXX.md` | §2-§5 |
| D1-D3 | `PERSONA-XXX.md` + `BR-YYY.md` | §3 Pain Points + §2 Context |
| V1-V2 | Gỡ ⓪ trong file gốc | Trực tiếp |

---

## 8. Lưu Kết quả

Sau phỏng vấn, tạo file:
```
docs/00-business/ELICITATION/RESPONSES/RS-{QS-ID}-{YYYY-MM-DD}.md
```

Dùng template `TEMPLATE-RESPONSE.md` (xem bên dưới).
