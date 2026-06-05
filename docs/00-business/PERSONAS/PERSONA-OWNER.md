---
id: PERSONA-OWNER
title: "Chủ doanh nghiệp / Founder"
type: "Persona"
domain: "Business"
status: "Draft-NeedsValidation"
tags: [persona, stakeholder, owner, decision-maker]
---

# Persona: Chủ doanh nghiệp / Founder

> **Mã:** `PERSONA-OWNER`
> **Loại:** Người ra Quyết định
> **Tham chiếu:** [STAKEHOLDERS.md](../STAKEHOLDERS.md)
>
> ⚠️ **Trạng thái dữ liệu:** Bản dựng từ context dự án (AGENTS.md, ECOSYSTEM_OVERVIEW.md, CATALOG.md). **Cần Owner thật xác nhận** các phần đánh dấu `⓪` trước khi dùng làm cơ sở viết SR/BR.

---

## 1. Hồ sơ Tóm tắt (Snapshot)

| Trường | Giá trị |
|--------|---------|
| **Tên gọi mẫu** | "Anh Khoa — Founder RinoEdu" |
| **Vai trò trong tổ chức** | Founder / CEO toàn chuỗi |
| **Cấp quản lý** | Toàn hệ thống đa cơ sở (Station + nhìn sang Tutor/Digital) |
| **Số lượng dự kiến trong tổ chức** | 1–2 (Founder + Co-founder) |
| **Vai trò trong `useAuthStore`** | `admin` (toàn quyền) |
| **Truy cập chính** | Web (laptop) + Mobile (xem nhanh) |
| **Tần suất sử dụng** | Hằng ngày (5–15 phút sáng + tối), sâu hơn vào cuối tuần / cuối tháng |

---

## 2. Mục tiêu Cá nhân (Personal Goals)

1. ⓪ Nắm được sức khỏe vận hành chuỗi qua một cái nhìn duy nhất, không phải đăng nhập 4 hệ thống (CRM/ERP/CARE/LMS).
2. ⓪ Tăng tỷ lệ tái phí học viên hằng quý, vì đây là chỉ số phản ánh chất lượng dịch vụ.
3. ⓪ Phát hiện sớm cơ sở hoặc giáo viên có vấn đề (tỷ lệ điểm danh thấp, complaint cao) trước khi mất khách.
4. Mở thêm cơ sở mới mà không phải đào tạo lại quy trình từ đầu — quy trình phải được "đóng gói" trong hệ thống.

---

## 3. Bài toán Đang Gặp (Pain Points)

| # | Vấn đề | Mức độ Ảnh hưởng | Tần suất |
|---|--------|-------------------|----------|
| 1 | Dữ liệu phân mảnh giữa CRM cũ, ERP cũ, CARE cũ — phải tổng hợp tay khi báo cáo HĐQT (tham chiếu `ECOSYSTEM_OVERVIEW.md` mục 3) | Cao | Hằng tháng |
| 2 | Hồ sơ học viên/phụ huynh trùng lặp giữa các hệ thống → khó biết doanh thu thực trên 1 khách hàng (vi phạm `[POLICY-MDM-01]` Golden Record) | Cao | Hằng ngày |
| 3 | ⓪ Không có dashboard "today" tự động — phụ thuộc Branch Manager báo cáo tay | Cao | Hằng ngày |
| 4 | ⓪ Không thấy được KPI giáo viên / cơ sở yếu kém kịp thời | Trung | Hằng tuần |
| 5 | Quyết định mở cơ sở mới chưa có cơ sở dữ liệu (vùng nào học viên chờ nhiều, nhân sự nào sẵn sàng chuyển) | Trung | Hằng quý |

---

## 4. Một Ngày Làm Việc Điển Hình (A Day in the Life)

> ⓪ Nội dung dưới là **giả định hợp lý** dựa trên hành vi Founder ngành EdTech. Cần phỏng vấn để xác nhận.

| Khoảng thời gian | Hoạt động | Công cụ đang dùng | Vấn đề gặp phải |
|------------------|-----------|-------------------|-----------------|
| 08:00 – 08:15 | Mở dashboard, xem tổng số học viên active, doanh thu hôm qua, ticket khẩn | Email + Excel tổng hợp (hiện tại) | Số liệu trễ 1 ngày, không real-time |
| 09:00 – 11:00 | Họp với 2-3 Branch Manager qua Zoom, review KPI tuần | Slack + Excel | Mỗi BM dùng định dạng báo cáo khác nhau |
| 13:30 – 15:00 | Phê duyệt yêu cầu chiến lược (mở cơ sở, ký đối tác B2B, thay chính sách giá) | Email | Thiếu context dữ liệu khi quyết định |
| 16:00 – 17:00 | Xem báo cáo tài chính cuối ngày (tham chiếu `STAKE-CFO`) | ERP cũ | Số liệu không khớp với CRM (do phân mảnh) |
| Cuối tuần | Sâu vào báo cáo tháng, phát hiện trend | Tổng hợp tay | 1-2 ngày làm việc thuần để có 1 báo cáo |

---

## 5. Quyết định Họ Phải Đưa Ra (Decisions)

| Quyết định | Tần suất | Thông tin cần | Hậu quả nếu sai |
|-----------|----------|----------------|------------------|
| Có mở thêm cơ sở mới ở khu vực X không? | Hằng quý | Dữ liệu lead theo vùng, nhân sự sẵn có, doanh thu cơ sở lân cận | Đầu tư sai → lỗ vài trăm triệu |
| Có thay đổi chính sách hoàn tiền không? (`BF-FIN-01`) | Hằng năm | Số phiếu hoàn / tổng đơn / lý do hoàn | Mất uy tín hoặc lỗ doanh thu |
| ⓪ Có sa thải / điều chuyển BM kém hiệu quả không? | Hiếm | KPI cơ sở 6 tháng, complaint, retention | Mất nhân sự cốt cán hoặc giữ người sai |
| Có ký đối tác B2B mới không? (`BF-MDM-03`) | Hằng quý | Năng lực đối tác, số học viên dự kiến | Rủi ro pháp lý / thương hiệu |
| Có đầu tư thêm tính năng X không? | Hằng quý | ROI feature cũ, feedback Stakeholder | Tốn ngân sách phát triển |

---

## 6. Năng lực & Hạn chế (Skills & Constraints)

| Hạng mục | Mô tả |
|----------|-------|
| **Trình độ công nghệ** | Trung bình–Cao. Quen với dashboard, không cần training để đọc bảng/biểu đồ. |
| **Thiết bị thường dùng** | MacBook tại văn phòng, iPhone khi di chuyển |
| **Kết nối mạng** | Văn phòng + 4G ổn định |
| **Ngôn ngữ giao tiếp** | Tiếng Việt là chính, đọc được English |
| **Hạn chế đặc biệt** | Thời gian rất hạn chế — mỗi báo cáo cần xem xong trong < 5 phút. Báo cáo dài → bỏ qua. |

---

## 7. Các "Job-To-Be-Done" Cốt lõi (JTBD)

1. **Khi** mở app vào đầu ngày làm việc, **tôi muốn** thấy ngay 1 màn hình tổng hợp 5–10 chỉ số quan trọng nhất toàn chuỗi (doanh thu hôm qua, học viên active, ticket khẩn, retention quý), **để** quyết định có cần can thiệp ngay hôm nay không.
2. **Khi** chuẩn bị họp với HĐQT hằng tháng, **tôi muốn** xuất ra báo cáo chuẩn về doanh thu / học viên / nhân sự theo cơ sở, **để** không phải tự tổng hợp tay từ nhiều hệ thống.
3. **Khi** xem một học viên cụ thể (do được khiếu nại lên), **tôi muốn** thấy đầy đủ profile + lịch sử mua hàng + lịch sử học + lịch sử chăm sóc trên một trang duy nhất, **để** quyết định cách xử lý mà không phải hỏi lại nhiều phòng.
4. **Khi** phát hiện 1 cơ sở có chỉ số bất thường (retention rớt, complaint tăng), **tôi muốn** drill-down xuống tới cấp giáo viên / lớp / học viên, **để** xác định nguồn cơn vấn đề.
5. **Khi** ký quyết định ngân sách quý, **tôi muốn** thấy chi phí vận hành theo cơ sở so với doanh thu, **để** phân bổ ngân sách công bằng và hiệu quả.

---

## 8. Yêu cầu Phái sinh (Stakeholder Requirements)

| Mã SR | Tiêu đề | Trạng thái |
|-------|---------|-----------|
| `SR-OWNER-001-dashboard-tong-quan-chuoi` | Dashboard tổng quan chuỗi (chưa tạo) | ⏳ |
| `SR-OWNER-002-bao-cao-thang-tu-dong` | Báo cáo tháng tự động (chưa tạo) | ⏳ |
| `SR-OWNER-003-360-view-hoc-vien` | View 360° học viên (chưa tạo) | ⏳ |
| `SR-OWNER-004-drill-down-co-so` | Drill-down chỉ số cơ sở (chưa tạo) | ⏳ |

---

## 9. Năng lực Hệ thống Liên quan (CAP Mapping)

| CAP | Mức độ Tương tác | Quyền (RBAC) | Phạm vi Dữ liệu (ABAC) | Tần suất |
|-----|-------------------|--------------|--------------------------|----------|
| `CAP-RPT` | Cao | View, Export | Toàn chuỗi | Hằng ngày |
| `CAP-FIN` | Cao | View, Approve | Toàn chuỗi | Hằng tuần |
| `CAP-OPS` | Trung | View | Toàn chuỗi (drill-down) | Hằng tuần |
| `CAP-HR` | Trung | View, Approve | Toàn chuỗi | Hằng tháng |
| `CAP-MDM` | Trung | View | Toàn chuỗi | Khi có vấn đề |
| `CAP-SYS` | Thấp | View | Toàn chuỗi | Hiếm |
| `CAP-FCM` | Thấp | View | Toàn chuỗi | Hiếm |

> **Lưu ý Capability–Persona Decoupling:** Owner và Branch Manager cùng dùng `CAP-OPS`/`CAP-RPT` nhưng khác **Phạm vi**. Đây là lý do `[POLICY-IAM-03]` (RBAC+ABAC) tồn tại — không tạo bản sao CAP theo role.

---

## 10. Câu Trích Dẫn Đặc Trưng (Quote)

> *"⓪ Tôi không cần biết Sale chốt từng đơn thế nào. Tôi cần biết hôm nay chuỗi của mình đang chảy đúng hướng hay không — chỉ trong 30 giây."*
