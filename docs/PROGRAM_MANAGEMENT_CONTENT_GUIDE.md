# Quản lý chương trình & Quản lý học liệu - Content guideline (Rinov DS)

## Mục tiêu
Chuẩn hóa wording cho 2 menu học thuật theo design system Rinov, đảm bảo nhất quán giữa sidebar, tiêu đề màn, bảng, form và thông báo trạng thái.

## 1. Quy ước menu
- `program_management`: `Quản lý chương trình`
- `curriculum`: `Quản lý học liệu`

## 2. Menu Quản lý chương trình
### 2.1 Tiêu đề màn
- Page title: `Quản lý chương trình`
- Page description: `Thiết lập thông tin chương trình, lộ trình áp dụng và trạng thái hoạt động.`

### 2.2 Màn danh sách
- Thẻ tổng quan: `Tất cả`, `Hoạt động`, `Ngưng hoạt động`
- Cột bảng:
  - `Chương trình`
  - `Tên viết tắt`
  - `Mã chương trình`
  - `Môn học`
  - `Lộ trình áp dụng`
  - `Sản phẩm áp dụng`
  - `Ngày tạo`
  - `Cho phép lùi bài`
  - `Trạng thái`
  - `Thao tác`
- Tooltip thao tác: `Ngưng hoạt động`, `Kích hoạt`, `Xem chi tiết`
- Empty state: `Không tìm thấy chương trình phù hợp.`

### 2.3 Modal Thông tin chương trình
- Tiêu đề: `Thông tin chương trình`
- Trường và placeholder:
  - `Tên chương trình *` - `Nhập tên chương trình`
  - `Tên viết tắt *` - `Nhập tên viết tắt`
  - `Mã chương trình *` - `Nhập mã chương trình`
  - `Môn học *` - `Chọn môn học`
  - `Loại hình liên hệ` - `Chọn loại hình liên hệ`
  - `Nhóm ngành` - `Chọn nhóm ngành`
  - `Loại hình kiểm tra` - `Chọn loại hình kiểm tra`
  - `Điều kiện xếp lớp` - `Chọn điều kiện xếp lớp`
  - `Phân loại chương trình` - `Chọn phân loại chương trình`
  - `Cho phép lùi bài` - `Chọn thiết lập lùi bài`
  - `Danh sách lộ trình *` - `Chọn lộ trình phù hợp`
- CTA:
  - `+ Thêm lộ trình`
  - Tạo mới: `Hủy` / `Lưu chương trình`
  - Xem chi tiết: `Đóng` / `Chỉnh sửa`
  - Chỉnh sửa: `Hủy` / `Lưu thay đổi`
- Empty state lộ trình đã chọn:
  - `Chưa có lộ trình được thêm.`
  - `Vui lòng chọn lộ trình từ danh sách và nhấn "Thêm lộ trình".`

### 2.4 Validation và toast
- Validation:
  - `Vui lòng nhập tên chương trình.`
  - `Vui lòng nhập tên viết tắt.`
  - `Vui lòng nhập mã chương trình.`
  - `Mã chương trình đã tồn tại.`
  - `Vui lòng chọn môn học.`
  - `Vui lòng chọn ít nhất 1 lộ trình.`
  - `Lộ trình đã được thêm trước đó.`
- Toast:
  - `Tạo chương trình thành công.`
  - `Cập nhật chương trình thành công.`
  - `Đã chuyển trạng thái chương trình sang Hoạt động.`
  - `Đã chuyển trạng thái chương trình sang Ngưng hoạt động.`

## 3. Menu Quản lý học liệu
### 3.1 Tiêu đề màn
- Page title: `Quản lý học liệu`
- Breadcrumb gốc: `Học liệu`

### 3.2 Màn danh sách học liệu
- Nút chức năng: `Tải lên`, `Tạo thư mục mới`
- Cột bảng:
  - `STT`
  - `Tên tài liệu / thư mục`
  - `Kích thước`
  - `Người chỉnh sửa cuối`
  - `Ngày sửa đổi`
  - `Thao tác`
- Tooltip thao tác dòng: `Đổi tên`, `Xóa`
- Empty state:
  - Root: `Chưa có học liệu`
  - Trong thư mục: `Thư mục này chưa có học liệu`
  - Mô tả: `Hãy tải tệp, tải thư mục hoặc tạo thư mục mới để bắt đầu.`

### 3.3 Modal và thông báo
- Modal tải lên:
  - Tiêu đề: `Tải học liệu`
  - Lựa chọn: `Tải tệp`, `Tải thư mục`
  - CTA phụ: `Hủy bỏ`
- Modal tạo thư mục:
  - Tiêu đề: `Tạo thư mục học liệu mới`
  - Placeholder: `Nhập tên thư mục`
  - CTA: `Hủy bỏ` / `Tạo thư mục`
- Modal đổi tên:
  - Tiêu đề: `Đổi tên học liệu`
  - Placeholder: `Nhập tên học liệu`
  - CTA: `Hủy bỏ` / `Lưu thay đổi`
- Modal xóa:
  - Tiêu đề: `Xác nhận xóa học liệu`
  - Nội dung: `Bạn chắc chắn muốn xóa <tên học liệu>?`
  - CTA: `Hủy bỏ` / `Xóa học liệu`

### 3.4 Validation
- `Vui lòng nhập tên thư mục.`
- `Tên thư mục đã tồn tại.`
- `Tên học liệu không được để trống.`
- `Tên học liệu đã tồn tại.`

## 4. Chuẩn viết theo DS
- Dùng câu ngắn, rõ nghĩa, ưu tiên động từ đầu câu với placeholder (`Nhập...`, `Chọn...`).
- Trạng thái dùng một chuẩn duy nhất: `Hoạt động` và `Ngưng hoạt động`.
- Tránh viết tắt ở tiêu đề/cột chính (ví dụ dùng `Mã chương trình` thay cho `Mã CT`, `Sản phẩm áp dụng` thay cho `SP áp dụng`).
