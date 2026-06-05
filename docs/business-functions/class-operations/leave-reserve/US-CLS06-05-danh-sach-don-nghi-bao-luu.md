---
id: US-CLS06-05
title: "Danh sách yêu cầu Nghỉ học, Bảo lưu & Chuyển lớp"
bf: BF-CLS-06
domain: CAP-CLS
status: draft
tags: [list, leave-reserve]
---

# US-CLS06-05: Danh sách yêu cầu Nghỉ học, Bảo lưu & Chuyển lớp

> **Tham chiếu:** BF-CLS-06 · Giao diện Mẫu §4.2 (Danh sách)
> **Đường dẫn màn hình:** `/app/leave_reserve`
> **Trạng thái áp dụng:** Chờ duyệt, Đã duyệt, Không duyệt, Hủy duyệt

## 1. Yêu cầu Người dùng (User Story)
**Là một** Nhân viên vận hành (CSM/Sale) hoặc Quản lý chi nhánh, **tôi muốn** xem danh sách các yêu cầu nghỉ học, bảo lưu hoặc chuyển lớp của học viên một cách rõ ràng và khoa học, **để** tôi có thể theo dõi và thực hiện các thao tác phê duyệt hoặc từ chối một cách nhanh chóng, chính xác.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập với các phân hệ khác.
> - [x] **N**egotiable — Chi tiết giao diện có thể điều chỉnh để tối ưu trải nghiệm.
> - [x] **V**aluable — Giúp giảm thiểu sai sót và tăng tốc độ duyệt đơn.
> - [x] **E**stimable — Đủ thông tin để ước lượng thời gian triển khai.
> - [x] **S**mall — Hoàn thành nâng cấp giao diện trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu rõ ràng tại mục 6.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-LIST-01]:** Danh sách hiển thị các yêu cầu nghỉ phép, bảo lưu học tập và nghỉ học tạm thời của học viên thuộc chi nhánh đang quản lý.
2. **[RULE-LIST-02]:** Tìm kiếm hỗ trợ quét các thông tin: Tên học viên, Mã học viên, Mã phiếu yêu cầu.
3. **[RULE-LIST-03]:** Quy trình phê duyệt trạng thái:
   - Một phiếu mới tạo sẽ ở trạng thái **Chờ duyệt**.
   - Người quản lý có thể **Phê duyệt** (chuyển sang trạng thái **Đã duyệt**) hoặc **Từ chối** (chuyển sang trạng thái **Không duyệt**).
   - Với những phiếu ở trạng thái **Đã duyệt** hoặc **Chờ duyệt**, người quản lý có thể thực hiện **Hủy duyệt** (chuyển sang trạng thái **Hủy duyệt**).
4. **[RULE-LIST-04]:** Lọc nâng cao bao gồm lọc theo loại phiếu yêu cầu và lọc theo trường phổ thông của học viên.

---

## 3. Cấu trúc Giao diện & Dữ liệu

### 3.1. Thanh công cụ
- **Chọn Chi nhánh:** Cho phép chọn chi nhánh cụ thể hoặc xem tất cả.
- **Ô tìm kiếm:** Nhập tên học viên, mã học viên hoặc mã phiếu để tìm kiếm nhanh.
- **Nút lọc nâng cao:** Mở bảng lọc bên cạnh để lọc chi tiết.
- **Nút Tạo đơn yêu cầu:** Mở biểu mẫu tạo yêu cầu mới.

### 3.2. Khối lọc Trạng thái (Status Tiles)
- **Tất cả:** Hiển thị tổng số lượng phiếu.
- **Chờ duyệt:** Lọc danh sách phiếu đang đợi xử lý.
- **Đã duyệt:** Lọc danh sách phiếu đã được chấp thuận.
- **Không duyệt:** Lọc danh sách phiếu bị từ chối.
- **Hủy duyệt:** Lọc danh sách phiếu đã bị hủy bỏ sau khi duyệt.

### 3.3. Bảng danh sách chính
Bảng danh sách hiển thị các thông tin sau theo định dạng chuẩn:

| Cột | Loại hiển thị | Trường Dữ liệu | Mô tả chi tiết |
|-----|---------------|----------------|----------------|
| **☐** | Hộp kiểm chọn | Chọn nhiều dòng | Dùng để thực hiện thao tác hàng loạt (nếu có) |
| **Phiếu** | Tiêu đề + Nhãn màu + Mã | Tên tiêu đề phiếu, nhãn phân loại (Nghỉ phép, Bảo lưu, Nghỉ học tạm thời), và mã phiếu bên dưới | Giúp nhận diện nhanh loại yêu cầu và mã định danh |
| **Học viên** | Họ tên + Mã định danh | Tên học viên và mã số học viên bên dưới | Thông tin định danh học viên |
| **Liên hệ** | Văn bản | Số điện thoại và địa chỉ email của học viên | Dùng để liên lạc nhanh khi cần |
| **Trường học** | Văn bản | Tên trường học phổ thông của học viên | Trường học hiện tại của học viên |
| **Lớp học** | Tên lớp + Mã lớp | Tên lớp học đang theo học và mã lớp bên dưới | Lớp hiện tại áp dụng yêu cầu |
| **Gói sản phẩm**| Văn bản | Tên gói học phí/sản phẩm đăng ký | Gói khóa học học viên đang tham gia |
| **Thời gian & Ngày tạo** | Ngày tháng | Khoảng thời gian nghỉ học/bảo lưu và ngày tạo phiếu bên dưới | Ghi rõ thời gian áp dụng và thời điểm yêu cầu |
| **Trạng thái** | Nhãn màu | Trạng thái duyệt (Chờ duyệt, Đã duyệt, Không duyệt, Hủy duyệt) và thông tin người duyệt bên dưới | Trạng thái kèm lịch sử xử lý (người duyệt, ngày duyệt nếu có) |
| **Thao tác** | Các nút chức năng chuẩn | Các nút hành động xử lý đơn | Xem chi tiết, Phê duyệt, Từ chối, Hủy duyệt dựa trên trạng thái của phiếu |

### 3.4. Bộ lọc nâng cao (Filter Panel)
- **Lọc theo loại phiếu:** Nghỉ phép, Bảo lưu, Nghỉ học tạm thời.
- **Lọc theo trường học:** Danh sách các trường phổ thông của học viên.
- **Lọc theo khoảng thời gian:** Tuần này, Tháng này, Tháng trước.

### 3.5. Phân trang
Hỗ trợ phân trang chuẩn `[20, 50, 100]` bản ghi trên mỗi trang.

---

## 4. Mô tả chi tiết (Màn hình & Luồng)

### 4.1. Mô tả Màn hình
Giao diện tuân thủ tuyệt đối cấu trúc trang danh sách của hệ thống:
- Thanh công cụ trên cùng chứa các bộ lọc nhanh và ô tìm kiếm, cùng nút mở bộ lọc nâng cao và nút tạo mới.
- Tiếp theo là khối các thẻ trạng thái thể hiện trực quan số lượng phiếu ở từng giai đoạn.
- Bảng danh sách hiển thị đầy đủ 10 cột thông tin rõ ràng, hỗ trợ thanh cuộn ngang khi màn hình nhỏ.
- Cột thao tác cuối cùng sử dụng bộ nút chuẩn hệ thống (DataTableActions) để đảm bảo tính đồng bộ và thẩm mỹ.

### 4.2. Luồng Hoạt động (Workflow)
- Bước 1: Nhân viên truy cập trang, hệ thống mặc định tải toàn bộ danh sách phiếu yêu cầu.
- Bước 2: Người dùng có thể tìm kiếm, chọn trạng thái nhanh trên các thẻ hoặc mở bộ lọc nâng cao để tìm phiếu cần xử lý.
- Bước 3: Đối với phiếu **Chờ duyệt**, người duyệt click nút Phê duyệt hoặc Từ chối trên cột Thao tác. Hệ thống hiển thị hộp thoại xác nhận. Khi xác nhận thành công, trạng thái phiếu cập nhật tương ứng.
- Bước 4: Đối với phiếu ở trạng thái **Đã duyệt**, người quản lý có thể click nút Hủy duyệt trong danh sách thao tác phụ để chuyển trạng thái về **Hủy duyệt** kèm xác nhận an toàn.

---

## 5. Corner Cases (Trường hợp đặc biệt)

| # | Tình huống đặc biệt (Corner Case) | Cách xử lý chi tiết | Ghi chú / Trạng thái |
|---|----------------------------------|---------------------|----------------------|
| 5.1 | Không có phiếu nào trong hệ thống | Hiển thị màn hình trống kèm mô tả hướng dẫn người dùng tạo đơn yêu cầu. | Áp dụng mẫu EmptyState |
| 5.2 | Không tìm thấy kết quả phù hợp | Hiển thị bảng trống kèm thông báo tìm kiếm không có kết quả. | |
| 5.3 | Lỗi kết nối dữ liệu | Hiển thị thông báo lỗi và nút bấm để tải lại trang. | Áp dụng mẫu ErrorState |

---

## 6. Tiêu chí Nghiệm thu (Acceptance Criteria)
- **AC-1 (Bố cục chuẩn):** Giao diện hiển thị đầy đủ 10 cột dữ liệu đã được cấu trúc lại, đặc biệt cột Thao tác nằm riêng biệt ở cuối bảng.
- **AC-2 (Cột thao tác đồng bộ):** Các thao tác phê duyệt, từ chối, hủy duyệt được chuyển về cột Thao tác ở góc phải bảng sử dụng component `DataTableActions` chuẩn của hệ thống, không hiển thị nút trực tiếp trong cột học viên khi rê chuột nữa.
- **AC-3 (Bộ lọc nâng cao):** Hỗ trợ lọc theo loại phiếu yêu cầu và danh sách các trường học phổ thông của học viên.
- **AC-4 (Xác nhận an toàn):** Các hành động thay đổi trạng thái phiếu (Phê duyệt, Từ chối, Hủy duyệt) đều hiển thị hộp thoại xác nhận `ConfirmDialog` trước khi thực thi.

---

## Chỉ dẫn cho AI Agent & Lập trình viên
- Màn hình sử dụng `LeaveReserveScreen` làm orchestrator.
- Cột thao tác sử dụng `<DataTableActions />` từ `@/components/shared`.
- Lọc theo trường học và loại phiếu được tích hợp vào `<FilterGroupSheetPanel />`.
- Đảm bảo tuân thủ thiết kế và không dùng Tailwind inline cho màu sắc của trạng thái, thay vào đó sử dụng `getStatusBadgeClass` và `statusColors.ts`.
