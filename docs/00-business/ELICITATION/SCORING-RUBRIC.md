---
id: SCORING-RUBRIC
title: "Thang Đo Pain Point & Ưu tiên"
type: "Guide"
domain: "Elicitation"
status: "Active"
tags: [guide, scoring, priority, pain-point, elicitation]
---

# Thang Đo Pain Point & Ưu tiên (Scoring Rubric)

> **Mục đích:** Chuẩn hóa cách đánh giá mức độ nghiêm trọng và tần suất của pain point, từ đó xếp hạng ưu tiên khách quan.
> **Dùng khi:** Sau mỗi buổi phỏng vấn, chấm điểm từng pain point phát hiện được.

---

## 1. Thang đo Mức độ Đau (Pain Level) — 1 đến 5

| Điểm | Mức độ | Mô tả | Ví dụ |
|------|--------|--------|-------|
| 1 | Không ảnh hưởng | Bất tiện rất nhỏ, không ai phàn nàn | Phải click thêm 1 nút |
| 2 | Bất tiện nhẹ | Gây khó chịu nhưng có workaround dễ | Copy-paste thay vì auto-fill |
| 3 | Mất thời gian đáng kể | Tốn ≥ 15 phút/lần, ảnh hưởng năng suất | Tìm kiếm thủ công trong Excel |
| 4 | Gây lỗi / mất khách | Dẫn đến sai sót hoặc mất cơ hội kinh doanh | Quên follow-up → mất lead |
| 5 | Chặn hoàn toàn công việc | Không thể tiếp tục nếu không giải quyết | Hệ thống sập, không điểm danh được |

---

## 2. Thang đo Tần suất (Frequency) — 1 đến 5

| Điểm | Tần suất | Mô tả |
|------|----------|--------|
| 1 | Hiếm khi | Vài lần/năm hoặc ít hơn |
| 2 | Hàng tháng | 1-3 lần/tháng |
| 3 | Hàng tuần | 1-3 lần/tuần |
| 4 | Hàng ngày | Mỗi ngày làm việc |
| 5 | Nhiều lần/ngày | ≥ 3 lần trong 1 ngày |

---

## 3. Công thức Priority Score

```
Priority Score = Pain × Frequency
```

- Thang điểm: **1 → 25**
- Điểm càng cao → ưu tiên giải quyết càng sớm.

---

## 4. Bảng Phân loại Ưu tiên

| Score | Mức độ | Hành động |
|-------|--------|-----------|
| 1–5 | 🟢 **Low** | Ghi nhận, xử lý khi có thời gian |
| 6–12 | 🟡 **Medium** | Lên kế hoạch trong sprint tiếp theo |
| 13–20 | 🟠 **High** | Ưu tiên cao, cần giải quyết sớm |
| 21–25 | 🔴 **Critical** | Khẩn cấp, ảnh hưởng nghiêm trọng đến vận hành |

---

## 5. Ví dụ Áp dụng

| Pain Point | Persona | Pain | Frequency | Score | Mức độ |
|-----------|---------|------|-----------|-------|--------|
| BM mất 30 phút mỗi sáng tìm GV thay khi có GV nghỉ đột xuất | BM | 4 | 4 | **16** | 🟠 High |
| CSM quên follow-up học viên vắng 3 buổi liên tiếp | CSM | 4 | 3 | **12** | 🟡 Medium |
| Teacher phải điểm danh trên giấy rồi nhập lại vào máy | Teacher | 3 | 5 | **15** | 🟠 High |
| Owner không xem được báo cáo doanh thu real-time | Owner | 3 | 2 | **6** | 🟡 Medium |
| Sale mất lead vì không có nhắc nhở tự động | Sale | 5 | 4 | **20** | 🟠 High |

---

## 6. Cách Dùng

1. Sau mỗi buổi phỏng vấn, liệt kê tất cả pain point phát hiện được.
2. Chấm điểm **Pain** và **Frequency** cho từng pain point (dùng bảng trên).
3. Tính **Score = Pain × Frequency**.
4. Phân loại theo bảng §4.
5. Ghi kết quả vào file `RS-*` mục "Pain Point Score".
6. Khi tổng hợp (Synthesis), tính **trung bình Score** từ nhiều buổi → xếp hạng Top 5.
