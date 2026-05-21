---
id: PERSONA-BRANCH_MANAGER
title: "Quản lý Cơ sở"
type: "Persona"
domain: "Business"
status: "Draft-NeedsValidation"
tags: [persona, stakeholder, branch-manager, daily-user]
---

# Persona: Quản lý Cơ sở

> **Mã:** `PERSONA-BRANCH-MANAGER`
> **Loại:** Người dùng Hằng ngày + Người ra Quyết định Cấp Cơ sở
> **Tham chiếu:** [STAKEHOLDERS.md](../STAKEHOLDERS.md)
>
> ⚠️ **Trạng thái dữ liệu:** Bản dựng từ context dự án. Phần đánh dấu `⓪` cần Branch Manager thật xác nhận.

---

## 1. Hồ sơ Tóm tắt (Snapshot)

| Trường | Giá trị |
|--------|---------|
| **Tên gọi mẫu** | "Chị Hương — BM cơ sở Quận 7" |
| **Vai trò trong tổ chức** | Quản lý 1 cơ sở (chi nhánh) |
| **Cấp quản lý** | Cá nhân + Đội Sale, CSM, Teacher của cơ sở |
| **Số lượng dự kiến trong tổ chức** | 1 BM / cơ sở. Toàn chuỗi có khoảng `[N]` BM. |
| **Vai trò trong `useAuthStore`** | `branch_manager` |
| **Truy cập chính** | Web (laptop văn phòng) là chính, mobile chỉ tham khảo |
| **Tần suất sử dụng** | Hằng ngày, ~3–5 giờ làm việc thực tế trong app |

---

## 2. Mục tiêu Cá nhân (Personal Goals)

1. Đảm bảo cơ sở vận hành trơn tru: lớp đủ học viên, giáo viên đủ giờ, không bị xung đột lịch.
2. ⓪ Đạt KPI doanh thu / retention được Owner giao.
3. Không để học viên "rơi rớt" — không có ai bị quên xếp lớp, quên chăm sóc, quên gia hạn.
4. ⓪ Báo cáo lên Owner đúng số liệu, không phải tổng hợp tay.

---

## 3. Bài toán Đang Gặp (Pain Points)

| # | Vấn đề | Mức độ Ảnh hưởng | Tần suất |
|---|--------|-------------------|----------|
| 1 | Sale chốt đơn xong nhưng học viên chờ xếp lớp lâu (nghiệp vụ `BF-CLS-01`) — không có cảnh báo SLA | Cao | Hằng ngày |
| 2 | Giáo viên báo nghỉ đột xuất → phải tự tay tìm GV thay (`BF-OPS-03 — US-OPS03-01 dạy thay`) | Cao | Hằng tuần |
| 3 | Phụ huynh complaint qua điện thoại nhưng CSM không log vào hệ thống → không có lịch sử khi BM xử lý sau (`BF-CARE-01`) | Cao | Hằng tuần |
| 4 | ⓪ Báo cáo cuối tháng phải tổng hợp từ nhiều bảng Excel khác nhau | Cao | Hằng tháng |
| 5 | Lịch tổng thể cơ sở (`US-OPS02-03`) khó nhìn khi có > 30 lớp đồng thời | Trung | Hằng tuần |

---

## 4. Một Ngày Làm Việc Điển Hình (A Day in the Life)

| Khoảng thời gian | Hoạt động | Công cụ đang dùng | Vấn đề gặp phải |
|------------------|-----------|-------------------|-----------------|
| 07:30 – 08:00 | Mở Dashboard cơ sở, kiểm tra: lớp hôm nay, GV có ai báo nghỉ, học viên trial hôm nay | Rinov5 / hệ thống cũ | ⓪ Không có cảnh báo "GV chưa confirm điểm danh hôm qua" |
| 08:00 – 09:30 | Duyệt đơn nghỉ phép GV (`US-CLS06-04`), xử lý dạy thay nếu cần | Rinov5 | Phải mở 2 màn hình đồng thời (lịch + danh sách GV rảnh) |
| 09:30 – 11:00 | Họp ngắn với Sale + CSM về pipeline tuần | Slack + Excel | Sale báo cáo bằng Excel cá nhân, không đồng nhất |
| 11:00 – 12:00 | Duyệt xếp lớp các học viên Sale chốt từ tuần trước (`US-CLS01-03`) | Rinov5 | Không có gợi ý lớp phù hợp tự động |
| 13:30 – 15:00 | Đi vòng cơ sở, kiểm tra phòng học, gặp giáo viên | Offline | — |
| 15:00 – 17:00 | Xử lý ticket CSM escalate, ký quyết định bảo lưu / chuyển lớp (`BF-CLS-06`) | Rinov5 | Quyết định cần xem profile 360 nhưng phải click qua nhiều tab |
| 17:00 – 17:30 | Xem KPI ngày, gửi báo cáo cuối ngày cho Owner | Excel + Email | Tổng hợp tay |

---

## 5. Quyết định Họ Phải Đưa Ra (Decisions)

| Quyết định | Tần suất | Thông tin cần | Hậu quả nếu sai |
|-----------|----------|----------------|------------------|
| Phê duyệt đơn nghỉ phép GV | Hằng ngày | Lịch dạy GV, có ai dạy thay được không | Lớp bị bỏ trống → khiếu nại |
| Phê duyệt xếp lớp / chuyển lớp | Hằng ngày | Sĩ số hiện tại, năng lực HV, khung giờ HV chấp nhận | HV bỏ học |
| Phê duyệt bảo lưu / hoàn phí | Hằng tuần | Lý do, lịch sử HV, chính sách `BF-FIN-01` | Lỗ doanh thu hoặc mất khách |
| ⓪ Đề xuất khen thưởng / cảnh cáo nhân sự | Hằng tháng | KPI nhân sự, complaint từ HV | Mất tinh thần đội |
| Ký quyết định mở lớp mới (`US-CLS02-02`) | Hằng tháng | Số HV chờ, GV sẵn sàng, phòng trống | Mở lớp không đủ HV → lỗ vận hành |

---

## 6. Năng lực & Hạn chế (Skills & Constraints)

| Hạng mục | Mô tả |
|----------|-------|
| **Trình độ công nghệ** | Trung bình. Quen Excel + tools quản lý phổ biến. Cần training cho hệ thống mới. |
| **Thiết bị thường dùng** | Laptop văn phòng (Windows). Mobile chỉ check email + Slack. |
| **Kết nối mạng** | Wifi cơ sở ổn định. Khi đi công tác: không nhất thiết kết nối được hệ thống. |
| **Ngôn ngữ giao tiếp** | Tiếng Việt thuần |
| **Hạn chế đặc biệt** | Phải xử lý nhiều việc song song — mỗi tác vụ trong app cần ≤ 3 click. |

---

## 7. Các "Job-To-Be-Done" Cốt lõi (JTBD)

1. **Khi** GV báo nghỉ đột xuất qua chat, **tôi muốn** mở 1 màn hình thấy ngay GV nào rảnh trong khung giờ đó cùng môn / cùng cấp, **để** xử lý dạy thay trong < 10 phút.
2. **Khi** Sale chốt đơn xong, **tôi muốn** hệ thống tự đưa HV vào danh sách chờ xếp lớp với SLA cảnh báo nếu quá X ngày, **để** không HV nào bị quên.
3. **Khi** xử lý complaint về 1 HV, **tôi muốn** mở 1 trang duy nhất thấy: lớp đang học, GV chủ nhiệm, lịch sử điểm danh, lịch sử ticket CSM, đơn hàng (`US-CLS03-04..16`), **để** quyết định mà không phải hỏi lại nhiều bên.
4. **Khi** xem lịch tổng cơ sở, **tôi muốn** filter nhanh theo phòng / GV / loại lớp + thấy heatmap lớp đang đông hay thưa, **để** ra quyết định mở lớp mới hay gộp lớp.
5. **Khi** kết thúc ngày, **tôi muốn** thấy tự động báo cáo hôm nay (HV trial, điểm danh, doanh thu, ticket mở/đóng), **để** không phải tổng hợp tay gửi Owner.

---

## 8. Yêu cầu Phái sinh (Stakeholder Requirements)

| Mã SR | Tiêu đề | Trạng thái |
|-------|---------|-----------|
| `SR-BRANCH_MANAGER-001-dashboard-co-so` | Dashboard cơ sở (chưa tạo) | ⏳ |
| `SR-BRANCH_MANAGER-002-day-thay-nhanh` | Workflow dạy thay < 10 phút (chưa tạo) | ⏳ |
| `SR-BRANCH_MANAGER-003-canh-bao-sla-xep-lop` | Cảnh báo SLA xếp lớp (chưa tạo) | ⏳ |

---

## 9. Năng lực Hệ thống Liên quan (CAP Mapping)

| CAP | Mức độ Tương tác | Quyền (RBAC) | Phạm vi Dữ liệu (ABAC) | Tần suất |
|-----|-------------------|--------------|--------------------------|----------|
| `CAP-OPS` | Cao | View, Update, Approve | Cơ sở của tôi | Hằng ngày |
| `CAP-CARE` | Cao | View, Approve escalate | Cơ sở của tôi | Hằng ngày |
| `CAP-HR` | Cao | View, Approve nghỉ phép | Nhân sự cơ sở | Hằng ngày |
| `CAP-FIN` | Trung | View, Approve refund | Doanh thu cơ sở | Hằng tuần |
| `CAP-ADM` | Trung | View pipeline | Cơ sở của tôi | Hằng tuần |
| `CAP-COM` | Trung | View | Đơn hàng cơ sở | Hằng tuần |
| `CAP-RPT` | Trung | View, Export | Cơ sở của tôi | Hằng ngày |
| `CAP-MDM` | Thấp | View | Học viên cơ sở | Khi có vấn đề |

> **Lưu ý:** BM dùng *cùng* `CAP-OPS` với Owner nhưng khác **Phạm vi** — Owner thấy toàn chuỗi, BM chỉ thấy cơ sở. Đây là RBAC+ABAC, không phải CAP riêng.

---

## 10. Câu Trích Dẫn Đặc Trưng (Quote)

> *"⓪ Mỗi sáng tôi mất 30 phút chỉ để biết hôm nay có ai báo nghỉ. Cái này lẽ ra hệ thống phải tự đẩy lên đầu màn hình."*

---

## 11. Chỉ dẫn cho AI Agent & Lập trình viên

- Đây là **Persona vận hành** — ưu tiên giảm thời gian / số click / thay vì tính năng đẹp.
- Notification proactive (cái gì đến tay BM trước khi BM phải tự tìm) là pattern cốt lõi cho persona này.
- Mọi tính năng "approve" của BM phải kèm Confirm Dialog (`[DS-P4]`) và ghi log.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** giả định BM dùng được Mobile cho tác vụ phức tạp — workflow chính là Web.
- **KHÔNG** đẩy quyết định cấp chuỗi (mở cơ sở mới, đổi chính sách giá) cho BM — đó là `PERSONA-OWNER`.
- **KHÔNG** tạo "Dashboard Branch Manager" như một CAP riêng — đó là 1 view của `CAP-RPT` với ABAC scope.
