---
id: US-ENR02-03
title: "Thao tác Ghép lớp và Buổi học"
bf: BF-ENR-02
domain: CAP-ADM
status: draft
tags: [enrollment, trial, form]
---

# US-ENR02-03: Thao tác Ghép lớp và Buổi học

> **Tham chiếu:** BF-ENR-02 · `[RULE-ENR-02-01]` · `[RULE-ENR-02-03]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** Giáo vụ / Quản lý chi nhánh (Người điều phối),
**tôi muốn** tìm một Lớp đang vận hành và chọn một hoặc nhiều Buổi học (Multi-session) để gán booking đang chờ vào,
**để** xác nhận lịch học thử chính thức với khách hàng và đảm bảo lớp không bị quá tải.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Bước chọn lớp, giao diện có thể thương lượng.
> - [x] **V**aluable — Đảm bảo kiểm soát sĩ số, ghép lớp phù hợp.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-FORM-01] Lọc lớp thông minh:** Danh sách lớp gợi ý phải lọc chính xác theo Cơ sở và Chương trình của booking.
2. **[RULE-FORM-02] Chỉ buổi tương lai:** Danh sách buổi học chỉ hiển thị các buổi ở tương lai (Thời gian bắt đầu > hiện tại).
3. **[RULE-FORM-03] Kiểm soát sĩ số:** Nếu tổng (Học viên chính thức + Học viên học thử) bằng hoặc vượt sĩ số tối đa, vô hiệu nút chọn, hiển thị nhãn "Đầy".
4. **[RULE-FORM-04] Phân quyền ghép lớp:** Chỉ Giáo vụ hoặc Quản lý được thực hiện. Tư vấn chỉ tạo phiếu nhu cầu.
5. **[RULE-FORM-05] Giới hạn số buổi:** Cho phép chọn nhiều buổi (Multi-session) nhưng tối đa không quá 3 buổi. Khi đã chọn đủ 3 buổi, các checkbox khác sẽ bị vô hiệu hóa.
6. **[RULE-FORM-06] Cập nhật Người phụ trách:** Khi thao tác ghép lớp thành công, hệ thống tự động gán 'Người phụ trách' (Owner) của Booking thành Giáo viên phụ trách của lớp học đó.

---

## 3. Cấu trúc Các trường nhập liệu

**Bố cục:** Hộp thoại chia 2 phần (thông tin & danh sách chọn), áp dụng thiết kế tối giản (Dense UI), không dùng viền (border-less) để tối ưu không gian.

### 3.1. Thông tin đầu vào

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| **Chọn lớp & buổi** | Bảng danh sách thả xuống (Accordion/Popover) | Có | Lớp & Buổi học | Hiển thị các lớp học khả dụng kèm nhãn Loại Lớp. Cho phép chọn nhiều buổi bằng Checkbox (Tối đa 3 buổi). Lớp/buổi đầy: vô hiệu + nhãn "Đầy". |
| Ghi chú cho giáo viên | Ô nhập văn bản dài | Không | Ghi chú | VD: "Bé cần hỗ trợ thêm về phát âm". |

### 3.2. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Ghép thành công | Lớp: Cambridge Starter A1 (12/15), Buổi: Starter S1 | Booking → "Đã ghép lớp", audit log ghi nhận. |
| Lớp đầy | Lớp IELTS J1 (12/12) | Nút chọn vô hiệu, nhãn "Đầy". |
| Lớp hết buổi | Lớp sắp kết thúc, 0 buổi tương lai | Thông báo "Lớp không còn buổi học nào". |

### 3.3. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy | Nút viền nhạt | Đóng hộp thoại. |
| Xác nhận ghép lớp | Nút màu nhấn | Kiểm tra lớp + buổi → Lưu → Đóng → Cập nhật trạng thái. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Lớp không có buổi tương lai | Thông báo "Lớp không còn buổi học nào trong tương lai". |
| 4.2 | Tất cả lớp đều đầy | Danh sách hiển thị, tất cả vô hiệu. Không chặn giao diện. |
| 4.3 | Ghép vào buổi đã qua | Hệ thống chặn và báo lỗi. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Sĩ số phải kiểm tra cả học viên chính thức lẫn học viên học thử đã ghép vào buổi.
- Khi ghép thành công: cập nhật lớp, buổi, ngày giờ vào booking, chuyển trạng thái, ghi audit log.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** cho ghép vượt sĩ số tối đa trừ khi có quyền ngoại lệ.
- **KHÔNG** cho ghép vào buổi đã diễn ra.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Lọc lớp | Mở ghép lớp cho booking Cambridge | Chỉ hiện lớp Cambridge. |
| V-02 | Sĩ số | Kiểm tra lớp đầy | Vô hiệu, nhãn "Đầy". |
| V-03 | Buổi tương lai | Kiểm tra danh sách | Chỉ buổi chưa diễn ra. |
| V-04 | Ghép thành công | Chọn lớp + buổi, xác nhận | Booking cập nhật, trạng thái đổi. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Lọc lớp chính xác | Mở ghép lớp | Chỉ hiện lớp đúng Cơ sở + Chương trình. |
| AC-02 | Chỉ buổi tương lai | Kiểm tra danh sách | Không hiện buổi đã qua. |
| AC-03 | Kiểm soát sĩ số | Kiểm tra lớp/buổi đầy | Vô hiệu, nhãn "Đầy". |
| AC-04 | Ghép thành công | Xác nhận | Trạng thái → "Đã ghép lớp", audit log. |
