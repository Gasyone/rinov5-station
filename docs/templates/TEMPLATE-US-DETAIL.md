---
id: US-XXX-YY-ZZ
title: "[Tên Màn Hình Chi Tiết]"
bf: BF-XXX-YY
domain: CAP-XXX
status: draft
tags: [tag1, detail]
---

# US-XXX-YY-ZZ: [Tên Màn Hình Chi Tiết]

> **Tham chiếu:** BF-XXX-YY · Giao diện Mẫu §4.3 (Trang chi tiết)

## 1. Yêu cầu Người dùng (User Story)
**Là một** [Vai trò], **tôi muốn** [Hành động], **để** [Mục đích].

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập.
> - [x] **N**egotiable — Chi tiết giao diện có thể thương lượng.
> - [x] **V**aluable — Mang lại giá trị rõ ràng.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-DETAIL-01]:** `NẾU` trạng thái 'Đã hủy', `THÌ` ẩn toàn bộ nút sửa/chuyển trạng thái.
2. **[RULE-DETAIL-02]:** Mọi thay đổi thông tin phải tự động ghi nhận vào Lịch sử hoạt động.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
*(Định nghĩa các con số giới hạn, định mức hoặc SLA áp dụng cho chi tiết này)*
- **[METRIC-01] Số lượng thẻ:** Tối đa gắn 10 thẻ (tags) cho mỗi đối tượng.
- **[METRIC-02] Lịch sử:** Tải mặc định 20 dòng lịch sử mới nhất, bấm "Xem thêm" để tải tiếp.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** 2 cột (Tóm tắt 30% / Chi tiết 70%).

### 3.1. Tiêu đề & Nút thao tác
| Nút | Loại | Logic chuyển trạng thái | Điều kiện |
|-----|------|-------------------------|-----------|
| Chuyển trạng thái | Nút màu tích cực | Đổi sang 'Hoàn thành' | `NẾU` đang 'Chờ duyệt' |
| Hủy bỏ | Nút màu cảnh báo | Hộp thoại xác nhận → 'Đã hủy' | Khóa vĩnh viễn |
| Sửa | Nút biểu tượng | Chuyển sang chế độ Sửa | |

### 3.2. Cột trái — Tóm tắt (Chỉ xem)
| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Tên | Chữ đậm lớn | Tên đối tượng | |
| Trạng thái | Nhãn màu | Trạng thái | Theo bộ màu chuẩn |
| Thông tin phụ | Chữ nhỏ mờ | Mã định danh | |

### 3.3. Cột phải — Chi tiết
| Khu vực | Loại | Trường | Ghi chú |
|---------|------|--------|---------|
| Thông tin chung | Tiêu đề-Giá trị | Các trường cơ bản | Chỉ xem. |
| Ghi chú/Gắn thẻ | Ô nhập liệu | Ghi chú, Thẻ phân loại | Sửa nhanh, tự lưu khi bấm ra ngoài. |

### 3.4. Lịch sử hoạt động
| Thành phần | Loại | Dữ liệu | Hoạt động |
|------------|------|---------|-----------|
| Dòng thời gian | Danh sách dọc | Nhật ký | Mới nhất trên cùng. |
| Ô nhập mới | Ô văn bản + Nút gửi | Thêm vào nhật ký | Ghi kèm thời gian + người dùng. |

---

## 4. Xử lý Ngoại lệ
| # | Tình huống | Cách xử lý |
|---|-----------|-----------|
| 4.1 | Mã đối tượng không tồn tại | Hiện thông báo "Không tìm thấy dữ liệu". |
| 4.2 | Thao tác Xóa/Hủy bỏ | Bắt buộc hiện Hộp thoại Xác nhận nguy hiểm trước khi thực thi. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tuân thủ chặt chẽ ranh giới trách nhiệm: Giao diện chi tiết chỉ hiển thị và điều phối các thành phần con, không ôm đồm xử lý logic dữ liệu phức tạp (giao cho tầng Service/Domain).
- Các hành động nguy hiểm (Xóa, Hủy, Thay đổi trạng thái quan trọng) phải bắt buộc thông qua hệ thống Xác nhận (Confirmation) thống nhất.
- Áp dụng các quy tắc phân quyền (Authorization) trước khi hiển thị các nút thao tác.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm nhóm thông tin hoặc thẻ (tab) ngoài mục 3.3.
- **KHÔNG** cho phép chuyển trạng thái ngoài sơ đồ vòng đời đã định nghĩa.
- **KHÔNG** bỏ qua bước xác nhận cho hành động có tính rủi ro cao.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Nút trạng thái | Thử ở mỗi trạng thái | Chỉ nút hợp lệ xuất hiện. |
| V-02 | Lịch sử | Thêm bản ghi mới | Nằm trên cùng, đúng thời gian + tên. |
| V-03 | Giao diện co giãn | Thu hẹp màn hình | Co từ 2 cột thành 1 cột. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|--------------------|-----------------------|-------------------|
| AC-01 | Bố cục 2 cột | So với §4.3 | 2 cột trên máy tính, 1 cột trên điện thoại. |
| AC-02 | Nút đúng logic | Bấm nút ở từng trạng thái | Chỉ nút hợp lệ xuất hiện theo bảng 3.1. |
| AC-03 | Lịch sử đầy đủ | Thêm nội dung mới | Mới nhất trên cùng, đúng thời gian + người. |
