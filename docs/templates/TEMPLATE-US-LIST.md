---
id: US-XXX-YY-ZZ
title: "[Tên Màn Hình Danh Sách]"
bf: BF-XXX-YY
domain: CAP-XXX
status: draft
tags: [tag1, list]
---

# US-XXX-YY-ZZ: [Tên Màn Hình Danh Sách]

> **Tham chiếu:** BF-XXX-YY · `[POLICY-XXX-YY]` · Giao diện Mẫu §4.2 (Danh sách)
> **Đường dẫn màn hình & Trạng thái liên quan:**
> - `[Đường dẫn URL 1]` -> Trạng thái: `[Trạng thái A]`
> - `[Đường dẫn URL 2]` -> Trạng thái: `[Trạng thái B]`



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

1. **[RULE-LIST-01]:** Khi vừa truy cập, chỉ hiển thị bản ghi "Đang hoạt động".
2. **[RULE-LIST-02]:** Tìm kiếm theo nhiều trường (Tên, Mã, Email), không phân biệt chữ hoa chữ thường.

### 2.1. Thông số & Định mức (Metrics & Thresholds)
*(Định nghĩa các con số giới hạn, định mức hoặc SLA áp dụng cho danh sách này)*
- **[METRIC-01] Hiệu năng (SLA):** Thời gian tải danh sách không quá 2 giây với 100,000 bản ghi.
- **[METRIC-02] Số lượng xuất file:** Tối đa xuất (export) 5,000 dòng mỗi lần.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
| Thành phần | Loại hiển thị | Logic | Ghi chú |
|------------|---------------|-------|---------|
| Chọn [Bối cảnh] | Danh sách thả xuống | Lọc theo phân loại | Mặc định: "Tất cả". |
| Ô tìm kiếm | Ô nhập chữ | Quét trường tên, mã | Gợi ý: "Tìm tên, mã...". |
| Nút Tạo mới | Nút màu nhấn | Mở biểu mẫu tạo mới | Kiểm tra quyền trước. |

### 3.2. Khối lọc Trạng thái
| Thành phần | Nhóm màu | Điều kiện | Ghi chú |
|------------|----------|-----------|---------|
| Tất cả | Mặc định | Bỏ lọc | |
| [Trạng thái 1] | Theo hệ thống màu chuẩn | Lọc theo trạng thái | |

### 3.3. Bảng danh sách chính
*Bấm vào dòng -> Chuyển đến trang chi tiết*

| Cột | Loại hiển thị | Trường Dữ liệu | Ghi chú |
|-----|---------------|----------------|---------|
| [Cột Chính] | Ảnh đại diện + Văn bản | Thông tin định danh | |
| Trạng thái | Nhãn màu | Trạng thái hiện tại | Theo bộ màu chuẩn |
| Ngày tạo | Văn bản | Ngày cập nhật | Định dạng: Ngày/Tháng/Năm |

### 3.4. Thao tác khi rê chuột vào dòng
| Nút | Loại | Logic | Điều kiện |
|-----|------|-------|-----------|
| [Thao tác 1] | Nút biểu tượng | Cập nhật | `NẾU trạng thái khác 'Bị Khóa'` |

### 3.5. Bảng lọc nâng cao
| Thành phần | Loại | Dữ liệu | Ghi chú |
|------------|------|---------|---------|
| Lọc [A] | Ô đánh dấu / Danh sách thả xuống | Lọc theo tiêu chí | |

### 3.6. Phân trang
Chuẩn `[20, 50, 100]` bản ghi/trang.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

*(Mô tả dễ hiểu, đầy đủ bằng ngôn ngữ tự nhiên để đội ngũ kỹ thuật có thể hiểu rõ và thực hiện được đúng yêu cầu. Không quy định định dạng cụ thể, người viết chủ động chọn cách thể hiện phù hợp như văn bản tự do, các bước thực hiện step-by-step, mã giả nghiệp vụ, hoặc vẽ sơ đồ luồng hoạt động...)*

### 4.1. Mô tả Màn hình
- [Người viết mô tả chi tiết bố cục trực quan, các khối thông tin hiển thị, và cách chúng bố trí trên giao diện để đội ngũ kỹ thuật dễ dàng hình dung.]

### 4.2. Luồng Hoạt động (Workflow)
- [Người viết mô tả luồng đi của nghiệp vụ, hành trình của người dùng từ khi bắt đầu cho đến khi hoàn thành các tác vụ trên màn hình danh sách này.]

---

## 5. Corner Cases (Trường hợp góc cạnh & Đặc biệt)

*(Bắt buộc phải liệt kê đầy đủ các trường hợp đặc biệt, ngoại lệ hoặc lỗi có thể xảy ra trong thực tế. Trong quá trình xây dựng, nếu phát sinh thêm bất kỳ trường hợp đặc biệt nào, người viết và lập trình viên phải lập tức cập nhật bổ sung vào bảng này.)*

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Không có dữ liệu trong hệ thống | Hiển thị màn hình trống với thông điệp hướng dẫn rõ ràng. | Áp dụng mẫu EmptyState |
| 5.2 | Tìm kiếm không trả về kết quả | Hiển thị bảng trống kèm thông báo không tìm thấy kết quả phù hợp. | |
| 5.3 | Mất kết nối khi đang tải danh sách | Hiển thị thông báo lỗi kết nối và nút bấm để người dùng thử tải lại. | Áp dụng mẫu ErrorState |
| 5.4 | Quyền hạn truy cập bị từ chối | Chặn hiển thị danh sách và chuyển hướng người dùng về giao diện thông báo lỗi quyền. | |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)

*(Liệt kê chi tiết các điều kiện xác định sản phẩm/tính năng được xem là hoàn thành. Viết dưới dạng danh sách gạch đầu dòng rõ ràng, cụ thể và dễ dàng kiểm thử.)*

- **AC-1 (Bố cục chuẩn):** Giao diện hiển thị đầy đủ các vùng chức năng theo cấu trúc: Thanh công cụ phía trên → Khối trạng thái → Bảng danh sách chính → Bộ phân trang ở dưới cùng.
- **AC-2 (Tìm kiếm chính xác):** Khi nhập từ khóa tìm kiếm, bảng chỉ hiển thị những bản ghi có trường thông tin trùng khớp, hỗ trợ tìm kiếm không phân biệt chữ hoa hay chữ thường.
- **AC-3 (Nhãn trạng thái đồng bộ):** Màu sắc hiển thị của các trạng thái phải được lấy tập trung từ hệ thống định nghĩa màu của doanh nghiệp, không được gán màu cứng trực tiếp trên giao diện.
- **AC-4 (Phân trang ổn định):** Việc chuyển đổi qua lại giữa các trang hoặc thay đổi số lượng bản ghi hiển thị trên mỗi trang phải đảm bảo tải và kết xuất chính xác tập dữ liệu tương ứng.

