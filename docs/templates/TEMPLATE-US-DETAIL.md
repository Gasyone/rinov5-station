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
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - `[Đường dẫn trang chi tiết hoặc Hộp thoại chi tiết]` -> Trạng thái: `[Các trạng thái được phép]`



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

## 4. Mô tả chi tiết (Màn hình & Luồng)

*(Mô tả dễ hiểu, đầy đủ bằng ngôn ngữ tự nhiên để đội ngũ kỹ thuật có thể hiểu rõ và thực hiện được đúng yêu cầu. Không quy định định dạng cụ thể, người viết chủ động chọn cách thể hiện phù hợp như văn bản tự do, các bước thực hiện step-by-step, mã giả nghiệp vụ, hoặc vẽ sơ đồ luồng hoạt động...)*

### 4.1. Mô tả Màn hình
- [Người viết mô tả chi tiết bố cục phân bổ (ví dụ: 2 cột Tóm tắt/Chi tiết hoặc các tab chức năng), cách hiển thị thông tin và điều phối các khu vực hiển thị.]

### 4.2. Luồng Hoạt động (Workflow)
- [Người viết mô tả luồng đi của dữ liệu chi tiết, các thao tác chuyển trạng thái, ghi nhận lịch sử hoạt động, và hành động tương tác của người dùng.]

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

*(Bắt buộc phải liệt kê đầy đủ các trường hợp đặc biệt, ngoại lệ hoặc lỗi có thể xảy ra trong thực tế. Trong quá trình xây dựng, nếu phát sinh thêm bất kỳ trường hợp đặc biệt nào, người viết và lập trình viên phải lập tức cập nhật bổ sung vào bảng này.)*

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Mã đối tượng không tồn tại hoặc sai đường dẫn | Chuyển hướng người dùng về trang thông báo không tìm thấy dữ liệu kèm nút quay lại danh sách. | |
| 5.2 | Người dùng bấm các thao tác nguy hiểm (Xóa, Hủy, Khóa) | Bắt buộc phải hiển thị một hộp thoại xác nhận nguy hiểm (ConfirmDialog) trước khi cho phép thực thi. | |
| 5.3 | Mất kết nối internet khi đang ghi chú nhanh (Auto-save) | Hiển thị thông báo nhỏ báo lỗi tự động lưu và giữ nguyên nội dung chưa lưu để người dùng sao chép hoặc thử lại. | |
| 5.4 | Bản ghi bị thay đổi bởi người dùng khác cùng lúc | Khi người dùng thực hiện thao tác, hệ thống báo lỗi xung đột dữ liệu và yêu cầu người dùng tải lại trang. | |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

*(Liệt kê chi tiết các điều kiện xác định sản phẩm/tính năng được xem là hoàn thành. Viết dưới dạng danh sách gạch đầu dòng rõ ràng, cụ thể và dễ dàng kiểm thử.)*

- **AC-1 (Bố cục 2 cột linh hoạt):** Màn hình đáp ứng đúng tỷ lệ thiết kế (Tóm tắt 30% / Chi tiết 70% trên máy tính) và co giãn thành 1 cột trên thiết bị di động.
- **AC-2 (Nút hành động hợp lệ):** Nút chuyển trạng thái hoặc sửa đổi chỉ xuất hiện đúng theo sơ đồ vòng đời và điều kiện nghiệp vụ được đặc tả ở mục 3.1.
- **AC-3 (Lịch sử cập nhật tức thì):** Khi thêm ghi chú mới hoặc thực hiện thay đổi thông tin thành công, dòng lịch sử hoạt động phải ngay lập tức hiển thị bản ghi nhật ký mới nhất trên cùng.
- **AC-4 (Xác nhận hành động nguy hiểm):** Mọi hành động Xóa/Hủy bỏ/Tạm khóa bắt buộc phải kích hoạt hộp thoại xác nhận trước khi cập nhật dữ liệu.

