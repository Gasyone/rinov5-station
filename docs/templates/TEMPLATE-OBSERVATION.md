---
id: TPL-OBS
title: "Job Shadowing — Quan sát Thực tế"
type: "Observation Template"
domain: "Elicitation"
status: "Active"
tags: [template, observation, job-shadowing, elicitation, babok]
---

# TPL-OBS: Job Shadowing — Quan sát Thực tế

> **Kỹ thuật BABOK:** Observation (Job Shadowing)
> **Mục đích:** Quan sát người dùng thực tế làm việc, ghi nhận hành vi, công cụ, vấn đề — KHÔNG can thiệp.
> **Khi nào dùng:** Khi cần hiểu "A Day in the Life" của Persona, phát hiện pain point ẩn mà phỏng vấn không thấy.

---

## 1. Thông tin Buổi Quan sát

| Mục | Giá trị |
|-----|---------|
| **Persona mục tiêu** | `PERSONA-XXX` (VD: BM, CSM, Sale, Teacher, Owner) |
| **Người quan sát** | ___ |
| **Ngày quan sát** | YYYY-MM-DD |
| **Thời lượng** | ___ phút (khuyến nghị 60-120 phút) |
| **Địa điểm / Cơ sở** | ___ |
| **Mục tiêu quan sát** | [Mô tả cụ thể: VD "Hiểu quy trình BM xử lý đơn hàng buổi sáng"] |

---

## 2. Hướng dẫn Người Quan sát

- **KHÔNG** hỏi hoặc gợi ý trong lúc quan sát — chỉ ghi chép.
- **KHÔNG** yêu cầu người được quan sát giải thích hành động.
- Ngồi/đứng ở vị trí có thể nhìn rõ màn hình và thao tác.
- Ghi chú theo thời gian thực (timestamp).
- Sau buổi quan sát, có thể hỏi 2-3 câu clarify ngắn.
- Lưu kết quả vào `ELICITATION/RESPONSES/RS-OBS-{Persona}-{ngày}.md`.

---

## 3. Checklist Quan sát

| Thời gian | Hoạt động đang làm | Công cụ sử dụng | Vấn đề gặp phải | Cảm xúc (quan sát) |
|-----------|--------------------|-----------------|-----------------|--------------------|
| HH:MM | | | | ○ Bình thường ○ Bực bội ○ Vui ○ Bối rối |
| HH:MM | | | | ○ Bình thường ○ Bực bội ○ Vui ○ Bối rối |
| HH:MM | | | | ○ Bình thường ○ Bực bội ○ Vui ○ Bối rối |
| HH:MM | | | | ○ Bình thường ○ Bực bội ○ Vui ○ Bối rối |
| HH:MM | | | | ○ Bình thường ○ Bực bội ○ Vui ○ Bối rối |
| HH:MM | | | | ○ Bình thường ○ Bực bội ○ Vui ○ Bối rối |

---

## 4. Ghi chú Không can thiệp

> Ghi lại những điều đáng chú ý mà KHÔNG hỏi người được quan sát:

- [ ] Có bước nào lặp lại nhiều lần (dấu hiệu thiếu automation)?
- [ ] Có chuyển đổi giữa nhiều công cụ/tab (dấu hiệu thiếu tích hợp)?
- [ ] Có ghi chép tay/giấy (dấu hiệu thiếu số hóa)?
- [ ] Có hỏi đồng nghiệp nhiều lần (dấu hiệu thiếu tài liệu/training)?
- [ ] Có biểu hiện bực bội/thở dài (dấu hiệu pain point)?

**Ghi chú tự do:**

```
___
```

---

## 5. Câu hỏi Clarify (Sau quan sát — tối đa 5 câu)

| # | Câu hỏi | Trả lời |
|---|---------|---------|
| 1 | Tôi thấy bạn [hành động X] — bạn làm vậy bao lâu/lần? | ___ |
| 2 | Khi [tình huống Y] xảy ra, bạn thường xử lý thế nào? | ___ |
| 3 | Công cụ [Z] bạn dùng — có điều gì bất tiện không? | ___ |

---

## 6. Output Mapping

| Quan sát | → Điền vào file | Mục cụ thể |
|----------|-----------------|------------|
| Hoạt động theo giờ | `PERSONA-XXX.md` | §4 A Day in the Life |
| Công cụ sử dụng | `PERSONA-XXX.md` | §5 Tools & Systems |
| Vấn đề gặp phải | `PERSONA-XXX.md` | §3 Pain Points |
| Bước lặp lại / thủ công | `BR-YYY.md` hoặc `SR-ZZZ.md` | Yêu cầu automation |
| Cảm xúc tiêu cực | `PERSONA-XXX.md` | §3 Frustrations |

---

## 7. Guardrails (Hàng rào An toàn)

- **KHÔNG** can thiệp hoặc gợi ý cách làm tốt hơn trong lúc quan sát.
- **KHÔNG** quay phim/chụp ảnh nếu chưa được đồng ý bằng văn bản.
- **KHÔNG** ghi PII (số điện thoại, email cá nhân) của khách hàng nhìn thấy trên màn hình.
- **Thời lượng tối đa:** 2 giờ/buổi — sau đó người được quan sát sẽ thay đổi hành vi.
- **Số buổi tối thiểu:** Quan sát ít nhất 2 người cùng Persona để có dữ liệu so sánh.
- **Bias cần tránh:** Hawthorne Effect — người biết bị quan sát sẽ làm "đẹp" hơn bình thường.
