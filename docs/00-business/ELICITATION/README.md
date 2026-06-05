---
id: ELICITATION_README
title: "Thư viện Câu hỏi Phỏng vấn — Hướng dẫn Sử dụng"
domain: Elicitation
status: Active
tags: [elicitation, questionnaire, interview, toolkit]
---

# Thư viện Câu hỏi Phỏng vấn (Elicitation Toolkit)

> **Vị trí:** `docs/00-business/ELICITATION/`
> **Vai trò:** Chuẩn hóa quy trình thu thập dữ liệu từ Stakeholder để điền vào Persona, BR, SR.
> **Theo chuẩn:** BABOK — Elicitation & Collaboration techniques.

---

## 1. Tại sao cần Thư viện Câu hỏi?

| Vấn đề | Giải pháp |
|--------|-----------|
| Mỗi người hỏi mỗi kiểu → dữ liệu không so sánh được | Bộ câu hỏi chuẩn, đáp án gợi ý |
| Hỏi xong không biết ghi vào đâu | Output Mapping rõ ràng (câu X → file Y mục Z) |
| Quên hỏi điều quan trọng | Checklist câu hỏi theo từng mục đích |
| Kết quả phỏng vấn bị mất | Lưu instance kết quả có cấu trúc |
| Mở cơ sở mới → phải nghĩ lại câu hỏi | Tái sử dụng bộ câu hỏi đã có |

---

## 2. Cấu trúc Thư mục

```
docs/00-business/ELICITATION/
├── README.md                          ← Bạn đang đọc
├── QS-PERSONA-VALIDATE.md            ← Validate 5 Persona (gỡ ⓪)
├── QS-BR-DISCOVERY.md                ← Khám phá BR mới
├── QS-CAP-CARE.md                    ← Chuyên sâu CAP-CARE
├── QS-CAP-OPS.md                     ← (tương lai)
├── QS-CAP-ADM.md                     ← (tương lai)
├── QS-ONBOARDING-NEW-BRANCH.md       ← (tương lai) Khi mở cơ sở mới
└── RESPONSES/                         ← Kết quả phỏng vấn (instances)
    ├── RS-PERSONA-VALIDATE-2026-05-25.md
    ├── RS-BR-DISCOVERY-2026-06-01.md
    └── ...
```

---

## 3. Danh sách Bộ Câu hỏi (Catalog)

| Mã | Tên | Mục đích | Persona mục tiêu | Thời lượng | Output → |
|----|-----|----------|-------------------|-----------|----------|
| `QS-PERSONA-VALIDATE` | Validate Persona | Xác nhận/bác bỏ giả định ⓪ trong 5 Persona | Tất cả 5 | 30 phút/persona | Persona (gỡ ⓪) |
| `QS-BR-DISCOVERY` | Khám phá BR mới | Tìm pain point chưa được ghi nhận → sinh BR | BM + Owner | 45 phút | BR mới + SR mới |
| `QS-CAP-CARE` | Chuyên sâu Chăm sóc | Validate SR-CSM-001/002, khám phá workflow CSM | CSM + BM | 30 phút | SR (validate) + US (bổ sung) |
| `QS-CAP-OPS` | Chuyên sâu Vận hành | Validate BR-002, workflow dạy thay/xếp lịch | BM + Teacher | 30 phút | SR + US |
| `QS-CAP-ADM` | Chuyên sâu Tuyển sinh | Validate BR-004, workflow Lead→Student | Sale + BM | 30 phút | SR + US |
| `QS-ONBOARDING-NEW-BRANCH` | Onboarding cơ sở mới | Thu thập yêu cầu khi mở chi nhánh mới | BM mới + Owner | 60 phút | BR + SR + Config |

---

## 4. Quy trình Sử dụng

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ 1. CHỌN     │     │ 2. PHỎNG VẤN │     │ 3. LƯU KẾT  │     │ 4. BIÊN TẬP  │
│ Bộ câu hỏi  │ ──► │ Dùng QS-*    │ ──► │ QUẢ          │ ──► │ TÀI LIỆU     │
│ phù hợp     │     │ hỏi + ghi    │     │ RS-* file    │     │ Persona/BR/SR │
└─────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

**Chi tiết:**

1. **Chọn:** Xem Catalog (mục 3) → chọn QS phù hợp mục đích.
2. **Phỏng vấn:** Mở file QS-*, đọc hướng dẫn §1, hỏi theo thứ tự.
3. **Lưu kết quả:** Tạo file `RESPONSES/RS-{QS-ID}-{YYYY-MM-DD}.md` theo template.
4. **Biên tập:** Dùng Output Mapping (§7 trong QS) để cập nhật Persona/BR/SR:
   - Gỡ `⓪` nếu giả định được xác nhận.
   - Sửa nội dung nếu giả định bị bác bỏ.
   - Tạo BR/SR mới nếu phát hiện pain point chưa ghi nhận.

---

## 5. Loại Câu hỏi Chuẩn

| Loại | Ký hiệu | Khi nào dùng | Ví dụ |
|------|---------|-------------|-------|
| **Chọn 1** | ○ A ○ B ○ C | Phân loại rõ ràng | "Bạn dùng thiết bị gì chính?" |
| **Chọn nhiều** | ☐ A ☐ B ☐ C | Liệt kê tất cả áp dụng | "Bạn dùng những hệ thống nào?" |
| **Thang điểm** | 1○2○3○4○5 | Đo mức độ / tần suất | "Mức độ hài lòng với tool hiện tại?" |
| **Có/Không** | ○ Có ○ Không | Gate question (nếu Có → hỏi tiếp) | "Bạn có dùng Excel để báo cáo?" |
| **Mở** | ___ | Khai thác sâu, không giới hạn | "Mô tả 1 ngày làm việc điển hình?" |
| **Xác nhận** | ○ Đúng ○ Sai ○ Một phần | Validate giả định ⓪ | "Đúng không: bạn mất 30p mỗi sáng?" |

---

## 6. Quy ước Lưu Kết quả (Response Instance)

Mỗi buổi phỏng vấn tạo 1 file:

```
RESPONSES/RS-{QS-ID}-{YYYY-MM-DD}.md
```

**Cấu trúc file Response:**

```markdown
---
id: RS-QS-PERSONA-VALIDATE-2026-05-25
questionnaire: QS-PERSONA-VALIDATE
date: 2026-05-25
interviewer: "[Tên người hỏi]"
interviewee_role: "CSM"
interviewee_branch: "Quận 7"
duration_actual: "35 phút"
status: "Completed"
---

# Kết quả: [Tên bộ câu hỏi] — [Ngày]

## Câu trả lời

| # | Câu hỏi | Trả lời | Ghi chú |
|---|---------|---------|---------|
| W1 | Vai trò? | CSM | — |
| A1 | ... | ... | ... |

## Phát hiện Mới (không có trong câu hỏi)
- [Ghi lại những điều người được hỏi chia sẻ ngoài câu hỏi]

## Action Items
- [ ] Gỡ ⓪ trong PERSONA-CSM.md mục 3 item #1
- [ ] Tạo SR mới: SR-CSM-004-...
- [ ] Cập nhật BR-001 mục 2.1
```

---

## 7. Mapping: Kết quả → Tài liệu

| Loại phát hiện | Tạo/Cập nhật file nào | Ví dụ |
|----------------|----------------------|-------|
| Xác nhận giả định ⓪ | Persona/BR/SR gốc (gỡ ⓪) | "Đúng, tôi mất 30p mỗi sáng" → gỡ ⓪ |
| Bác bỏ giả định ⓪ | Persona/BR/SR gốc (sửa nội dung) | "Không, tôi chỉ mất 10p" → sửa |
| Pain point mới | Tạo BR mới hoặc bổ sung vào BR hiện có | "Tôi còn gặp vấn đề Y" → BR-005 |
| Nhu cầu cụ thể mới | Tạo SR mới | "Tôi cần tính năng Z" → SR-CSM-004 |
| Workflow mới | Cập nhật Persona §4 (A Day in the Life) | "Thực ra buổi chiều tôi làm X" |
| Quyết định mới | Cập nhật Persona §5 (Decisions) | "Tôi còn phải quyết định Y" |
| Xung đột với tài liệu hiện có | Ghi vào AUDIT hoặc BACKLOG | "Menu X không ai dùng" |

---

## 8. Lịch Phỏng vấn Đề xuất

| Tuần | Bộ câu hỏi | Persona | Mục tiêu |
|------|-----------|---------|-----------|
| 1 | QS-PERSONA-VALIDATE | CSM (1-2 người) | Gỡ ⓪ PERSONA-CSM |
| 1 | QS-PERSONA-VALIDATE | BM (1 người) | Gỡ ⓪ PERSONA-BM |
| 2 | QS-CAP-CARE | CSM + BM | Validate SR-CSM-001/002 |
| 2 | QS-PERSONA-VALIDATE | Sale (1 người) | Gỡ ⓪ PERSONA-SALE |
| 3 | QS-BR-DISCOVERY | Owner + BM | Tìm BR mới cho 7 CAP TBD |
| 3 | QS-PERSONA-VALIDATE | Teacher (1 người) | Gỡ ⓪ PERSONA-TEACHER |
| 4 | QS-CAP-OPS | BM + Teacher | Validate BR-002 |
