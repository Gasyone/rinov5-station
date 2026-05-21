---
id: PERSONA-TEACHER
title: "Giáo viên Đứng lớp"
type: "Persona"
domain: "Business"
status: "Draft-NeedsValidation"
tags: [persona, stakeholder, teacher, class-operation]
---

# Persona: Giáo viên Đứng lớp

> **Mã:** `PERSONA-TEACHER`
> **Loại:** Người dùng Hằng ngày — Periodic User
> **Tham chiếu:** [STAKEHOLDERS.md](../STAKEHOLDERS.md)
>
> ⚠️ **Trạng thái dữ liệu:** Phần `⓪` cần Giáo viên thật xác nhận. Đặc biệt phần Mobile vs Desktop preference.

---

## 1. Hồ sơ Tóm tắt (Snapshot)

| Trường | Giá trị |
|--------|---------|
| **Tên gọi mẫu** | "Cô Mai — GV Tiếng Anh, cơ sở Cầu Giấy" |
| **Vai trò trong tổ chức** | Giáo viên đứng lớp (có thể là chủ nhiệm) |
| **Cấp quản lý** | Cá nhân + lớp được phân công |
| **Số lượng dự kiến trong tổ chức** | 5–15 GV / cơ sở (tùy quy mô) |
| **Vai trò trong `useAuthStore`** | `teacher` |
| **Truy cập chính** | ⓪ Mobile (trên lớp / di chuyển) + Web (chuẩn bị giáo án ở văn phòng GV) |
| **Tần suất sử dụng** | Trước/sau mỗi buổi dạy (3–5 lần/ngày), không liên tục như Sale/CSM |

---

## 2. Mục tiêu Cá nhân (Personal Goals)

1. Hoàn thành đầy đủ điểm danh, nhận xét, BTVN sau mỗi buổi (`BF-CLS-05`) trong thời gian ngắn nhất.
2. Theo dõi tiến độ + năng lực HV trong lớp mình dạy (`US-CLS03-08 — Tab Năng lực`).
3. ⓪ Đạt KPI giờ dạy + đánh giá chất lượng (`BF-QA-01`).
4. ⓪ Báo nghỉ / dạy thay khi có việc đột xuất mà không phải tự gọi tìm GV thay.

---

## 3. Bài toán Đang Gặp (Pain Points)

| # | Vấn đề | Mức độ Ảnh hưởng | Tần suất |
|---|--------|-------------------|----------|
| 1 | Điểm danh sau buổi dạy mất 5–10 phút (`US-CLS05-01`) — quá lâu khi GV phải dạy lớp tiếp theo | Cao | Mỗi buổi |
| 2 | Khi báo nghỉ, không biết có GV thay không → BM gọi điện mới biết (`US-OPS03-01`) | Cao | Hằng tuần |
| 3 | ⓪ Không có cách nhanh xem profile học viên trước buổi dạy (`US-CLS03-04`) — phải hỏi BM | Trung | Mỗi buổi |
| 4 | Bài tập về nhà phải tổng hợp điểm tay rồi nhập vào hệ thống (`US-CLS05-05`) | Trung | Hằng tuần |
| 5 | ⓪ Phản hồi từ phụ huynh / HV không đến tay GV (`US-CLS04-10`) → không biết để cải thiện | Trung | Hằng tháng |

---

## 4. Một Ngày Làm Việc Điển Hình (A Day in the Life)

| Khoảng thời gian | Hoạt động | Công cụ | Vấn đề |
|------------------|-----------|---------|--------|
| Trước buổi dạy 30 phút | ⓪ Mở app xem lớp hôm nay, profile HV, BTVN tuần trước | Mobile / laptop văn phòng GV | ⓪ Có khi 4G yếu trong tòa nhà |
| Trong buổi dạy | Dạy — không tương tác hệ thống | — | — |
| Ngay sau buổi dạy 5 phút | Điểm danh nhanh, nhận xét, giao BTVN (`US-CLS05-01`) | Mobile (lý tưởng) | Form quá dài cho mobile |
| Cuối ngày | Vào hệ thống (laptop) chuẩn bị giáo án ngày mai, xem nhận xét tuần | Web | — |
| Hằng tuần | Cập nhật đánh giá định kỳ (`US-CLS05-02`), xem giờ dạy tích lũy (`US-CLS04-09`) | Web | — |

---

## 5. Quyết định Họ Phải Đưa Ra (Decisions)

| Quyết định | Tần suất | Thông tin cần | Hậu quả nếu sai |
|-----------|----------|----------------|------------------|
| Đánh giá điểm / nhận xét HV sau buổi | Mỗi buổi | Tiến độ HV, mục tiêu khung chương trình | Đánh giá lệch → phụ huynh khiếu nại |
| Đề xuất chuyển trình độ HV (lên / xuống lớp) | Hằng tháng | Năng lực HV qua các buổi, kết quả test | HV không phù hợp lớp → bỏ học |
| Báo nghỉ phép | Hiếm | Lịch dạy, quy định nghỉ phép `BF-HR-02` | BM khó sắp dạy thay |
| Yêu cầu đổi phòng (`US-OPS03-02`) | Hiếm | Tình trạng phòng, quy mô lớp | Lớp bị gián đoạn |

---

## 6. Năng lực & Hạn chế (Skills & Constraints)

| Hạng mục | Mô tả |
|----------|-------|
| **Trình độ công nghệ** | ⓪ Đa dạng — từ thấp (GV lớn tuổi) đến cao (GV trẻ). Mặc định: Trung bình. |
| **Thiết bị thường dùng** | ⓪ Mobile khi trong giờ dạy + laptop ở văn phòng GV |
| **Kết nối mạng** | ⓪ Wifi cơ sở ổn định, đôi khi không có sóng 4G ở phòng học sâu |
| **Ngôn ngữ giao tiếp** | Tiếng Việt + ngoại ngữ chuyên môn (tùy môn) |
| **Hạn chế đặc biệt** | Thời gian giữa các buổi rất ngắn (10–15 phút). Tác vụ trong app phải hoàn thành ≤ 3 phút. |

---

## 7. Các "Job-To-Be-Done" Cốt lõi (JTBD)

1. **Khi** chuẩn bị bước vào lớp dạy, **tôi muốn** mở app thấy ngay danh sách HV hôm nay + tag "cần chú ý" (`US-CLS03-03`), **để** vào lớp gọi tên đúng và quan sát đúng người.
2. **Khi** kết thúc buổi dạy, **tôi muốn** điểm danh + nhận xét + giao BTVN trong cùng 1 form ngắn ≤ 3 phút, **để** không trễ buổi dạy tiếp theo.
3. **Khi** cần báo nghỉ đột xuất, **tôi muốn** thao tác trên mobile và thấy gợi ý "GV nào có thể dạy thay" để đề xuất luôn, **để** lớp không bị bỏ trống.
4. **Khi** xem 1 HV cụ thể, **tôi muốn** thấy lịch sử nhận xét (`US-CLS03-06`), năng lực qua các kỳ test (`US-CLS03-08`), bài tập về nhà tuần qua, **để** điều chỉnh phương pháp dạy.
5. **Khi** đến cuối tháng, **tôi muốn** xem báo cáo giờ dạy + đánh giá chất lượng của tôi (`US-CLS04-08, 09`), **để** biết mình đang ở đâu trong KPI.

---

## 8. Yêu cầu Phái sinh (Stakeholder Requirements)

| Mã SR | Tiêu đề | Trạng thái |
|-------|---------|-----------|
| `SR-TEACHER-001-diem-danh-mobile-3-phut` | Điểm danh trên mobile ≤ 3 phút (chưa tạo) | ⏳ |
| `SR-TEACHER-002-bao-nghi-co-goi-y-thay` | Báo nghỉ có gợi ý GV thay (chưa tạo) | ⏳ |
| `SR-TEACHER-003-profile-hv-truoc-buoi-day` | Profile HV xem nhanh trước buổi (chưa tạo) | ⏳ |

---

## 9. Năng lực Hệ thống Liên quan (CAP Mapping)

| CAP | Mức độ Tương tác | Quyền (RBAC) | Phạm vi (ABAC) | Tần suất |
|-----|-------------------|--------------|----------------|----------|
| `CAP-OPS` | Cao | View, Update (điểm danh, nhận xét) | Lớp tôi dạy | Mỗi buổi |
| `CAP-ACD` | Trung | View | Khung chương trình lớp tôi | Hằng tuần |
| `CAP-CARE` | Thấp | View | Ticket HV lớp tôi | Khi liên quan |
| `CAP-HR` | Thấp | View, Create đơn nghỉ | Cá nhân | Hiếm |
| `CAP-MDM` | Thấp | View | HV lớp tôi | Khi cần xem profile |

> **Lưu ý Capability–Persona Decoupling:** Teacher dùng `CAP-OPS` (cùng với BM, Owner, CSM) nhưng phạm vi *hẹp nhất* — chỉ lớp được phân công. Đây là minh họa rõ nhất cho quy tắc Data Scope (`[POLICY-ORG-01]`).

---

## 10. Câu Trích Dẫn Đặc Trưng (Quote)

> *"⓪ Sau buổi dạy tôi chỉ có 10 phút trước khi vào lớp tiếp theo. Form điểm danh dài 3 trang là tôi bỏ — sẽ làm cuối ngày, mà cuối ngày là quên."*

---

## 11. Chỉ dẫn cho AI Agent & Lập trình viên

- Đây là persona **mobile-friendly nhất** trong 5 persona — UI điểm danh / nhận xét phải tốt trên mobile (touch target ≥ 44px theo `[R3]`).
- Phạm vi dữ liệu rất hẹp (lớp tôi dạy) — sai về Data Scope sẽ phá vỡ trải nghiệm.
- Thời gian xử lý mỗi tác vụ là **ràng buộc cứng** — performance là tính năng.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** cho Teacher xem HV ngoài lớp được phân công (vi phạm `[POLICY-ORG-01]`).
- **KHÔNG** giả định Teacher dùng được desktop trong giờ dạy — bắt buộc support mobile workflow.
- **KHÔNG** tạo "Quản lý Học viên" CAP riêng cho Teacher — đó là 1 view của `CAP-OPS` với scope hẹp.
- **KHÔNG** đẩy thông báo sản phẩm / chiến dịch tái phí cho Teacher — đó là việc của CSM/Sale.
