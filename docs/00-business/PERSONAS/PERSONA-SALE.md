---
id: PERSONA-SALE
title: "Tư vấn Tuyển sinh"
type: "Persona"
domain: "Business"
status: "Draft-NeedsValidation"
tags: [persona, stakeholder, sale, daily-user]
---

# Persona: Tư vấn Tuyển sinh (Sale)

> **Mã:** `PERSONA-SALE`
> **Loại:** Người dùng Hằng ngày — Power User
> **Tham chiếu:** [STAKEHOLDERS.md](../STAKEHOLDERS.md)
>
> ⚠️ **Trạng thái dữ liệu:** Phần `⓪` cần Sale thật xác nhận.

---

## 1. Hồ sơ Tóm tắt (Snapshot)

| Trường | Giá trị |
|--------|---------|
| **Tên gọi mẫu** | "Anh Đạt — Sale cơ sở Cầu Giấy" |
| **Vai trò trong tổ chức** | Tư vấn viên / Sales Consultant |
| **Cấp quản lý** | Cá nhân (báo cáo BM) |
| **Số lượng dự kiến trong tổ chức** | 2–4 Sale / cơ sở |
| **Vai trò trong `useAuthStore`** | `sale` |
| **Truy cập chính** | Web (laptop) khi tư vấn tại cơ sở. Mobile khi đi gặp khách. |
| **Tần suất sử dụng** | Hằng ngày, gần như liên tục trong giờ làm |

---

## 2. Mục tiêu Cá nhân (Personal Goals)

1. ⓪ Đạt target chốt đơn theo tháng (commission gắn với số HV mới + giá trị đơn).
2. Theo dõi pipeline lead — không để lead nguội mà quên follow-up (`BF-CRM-02`).
3. Có dữ liệu / lịch sử lead trong tay khi gọi điện hay gặp phụ huynh trực tiếp.
4. ⓪ Tận dụng được sự kiện tuyển sinh (`BF-ENR-03`) để săn lead chất lượng.

---

## 3. Bài toán Đang Gặp (Pain Points)

| # | Vấn đề | Mức độ Ảnh hưởng | Tần suất |
|---|--------|-------------------|----------|
| 1 | Một phụ huynh từng gọi vào CRM cũ, sau đó được đăng ký test trên hệ thống khác → khi gọi lại mất context, hỏi lại từ đầu (vi phạm `[POLICY-MDM-01]`) | Cao | Hằng ngày |
| 2 | Sau khi chốt đơn, không biết khi nào HV được xếp lớp → phụ huynh hỏi mà không trả lời được | Cao | Hằng tuần |
| 3 | Pipeline lead quá nhiều → quên follow-up, lead nguội → mất khách | Cao | Hằng ngày |
| 4 | ⓪ Báo cáo cuối tháng cho BM phải gõ tay vào Excel | Trung | Hằng tháng |
| 5 | ⓪ Khi sự kiện tuyển sinh kết thúc, không biết ai đã đăng ký test, ai chưa | Trung | Hằng tháng |

---

## 4. Một Ngày Làm Việc Điển Hình (A Day in the Life)

| Khoảng thời gian | Hoạt động | Công cụ | Vấn đề |
|------------------|-----------|---------|--------|
| 08:30 – 09:30 | Mở danh sách lead, sort theo "ngày liên hệ cuối", lên kế hoạch gọi 10–15 cuộc | Rinov5 | ⓪ Sort thủ công, không có gợi ý "lead cần gọi nhất" |
| 09:30 – 11:30 | Gọi điện theo danh sách — note lại trong CRM (`BF-CRM-02`) | Rinov5 + điện thoại | Note không structured, sau khó tìm lại |
| 13:30 – 15:00 | Tiếp phụ huynh tại cơ sở: tư vấn, đăng ký test (`US-BT02`), giới thiệu sản phẩm (`BF-PRD-01`) | Rinov5 | Phải mở 3 màn hình: Lead → Booking Test → Product |
| 15:00 – 16:30 | Theo dõi phụ huynh đã đặt test → check kết quả test (`US-BT04`) → chốt sản phẩm (`BF-SAL-01`) | Rinov5 | Nhiều bước rời rạc, không workflow nối |
| 16:30 – 17:30 | Tổng hợp số liệu trong ngày, báo cáo cho BM | Excel | Tổng hợp tay |

---

## 5. Quyết định Họ Phải Đưa Ra (Decisions)

| Quyết định | Tần suất | Thông tin cần | Hậu quả nếu sai |
|-----------|----------|----------------|------------------|
| Đề xuất sản phẩm/combo nào cho lead | Mỗi tư vấn | Profile HV, kết quả test, ngân sách | Đề xuất sai → mất đơn |
| Có giảm giá / khuyến mãi không | Mỗi đơn | Chính sách giá, target tháng | Lỗ margin hoặc mất khách |
| Có chuyển lead "khó" cho BM hay đồng nghiệp | Hằng tuần | Lịch sử lead, năng lực bản thân | Mất khách |
| ⓪ Có ưu tiên lead này hơn lead kia không | Hằng ngày | Mức độ "nóng" của lead | Lead nguội |

---

## 6. Năng lực & Hạn chế (Skills & Constraints)

| Hạng mục | Mô tả |
|----------|-------|
| **Trình độ công nghệ** | Trung bình. Quen tools CRM, không quen Excel phức tạp. |
| **Thiết bị thường dùng** | Laptop tại cơ sở + Mobile khi đi gặp khách bên ngoài |
| **Kết nối mạng** | Wifi cơ sở ổn định, đôi khi 4G yếu khi đi gặp khách |
| **Ngôn ngữ giao tiếp** | Tiếng Việt + giao tiếp thuyết phục là kỹ năng chính |
| **Hạn chế đặc biệt** | Mỗi cuộc gặp / cuộc gọi 5–15 phút — không có thời gian để đào tạo trong app |

---

## 7. Các "Job-To-Be-Done" Cốt lõi (JTBD)

1. **Khi** mở app vào đầu ngày, **tôi muốn** thấy danh sách lead cần gọi hôm nay (sort theo "nóng nhất"), **để** không quên ai và làm việc có ưu tiên.
2. **Khi** một phụ huynh gọi đến, **tôi muốn** ngay lập tức tìm được profile của họ (theo SĐT, tên, hoặc tên con) trong < 5 giây, **để** giữ trải nghiệm tư vấn liền mạch.
3. **Khi** đang tư vấn 1 phụ huynh, **tôi muốn** từ profile có thể đặt test (`US-BT02`), tạo quote sản phẩm, ký đơn (`US-SAL-01`) trong cùng 1 luồng, **để** không mất khách giữa chừng vì chuyển màn hình.
4. **Khi** chốt đơn xong, **tôi muốn** nhìn được trạng thái xếp lớp HV của tôi để trả lời phụ huynh, **để** giữ uy tín cá nhân.
5. **Khi** sự kiện tuyển sinh diễn ra (`BF-ENR-03`), **tôi muốn** check-in lead nhanh ngay tại bàn, **để** không bỏ sót thông tin liên hệ.

---

## 8. Yêu cầu Phái sinh (Stakeholder Requirements)

| Mã SR | Tiêu đề | Trạng thái |
|-------|---------|-----------|
| `SR-SALE-001-pipeline-lead-uu-tien` | Pipeline lead có gợi ý ưu tiên (chưa tạo) | ⏳ |
| `SR-SALE-002-tu-van-mot-luong` | Workflow tư vấn 1 luồng (chưa tạo) | ⏳ |
| `SR-SALE-003-tracking-trang-thai-xep-lop` | Theo dõi trạng thái xếp lớp HV của tôi (chưa tạo) | ⏳ |

---

## 9. Năng lực Hệ thống Liên quan (CAP Mapping)

| CAP | Mức độ Tương tác | Quyền (RBAC) | Phạm vi (ABAC) | Tần suất |
|-----|-------------------|--------------|----------------|----------|
| `CAP-ADM` | Cao | View, Create, Update | Lead của tôi + cơ sở | Hằng ngày |
| `CAP-COM` | Cao | View, Create đơn, Update | Đơn của tôi + cơ sở | Hằng ngày |
| `CAP-MDM` | Trung | View, Create Person | Person/Family liên quan lead | Hằng ngày |
| `CAP-OPS` | Thấp | View | HV tôi đã chốt | Khi phụ huynh hỏi |
| `CAP-RPT` | Thấp | View | Pipeline cá nhân | Hằng tuần |

---

## 10. Câu Trích Dẫn Đặc Trưng (Quote)

> *"⓪ Tôi không muốn nhập 1 phụ huynh 3 lần ở 3 hệ thống. Mất 5 phút mỗi lần là mất cơ hội chốt khách."*
