---
id: US-BT03
title: "Xem & Cập nhật chi tiết Booking Test"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, detail]
---

# US-BT03: Xem & Cập nhật chi tiết Booking Test

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.3 (Trang chi tiết)

## 1. Yêu cầu Người dùng (User Story)

**Là một** nhân viên Tư vấn / Quản lý chi nhánh / Giáo viên,
**tôi muốn** xem chi tiết lịch kiểm tra, chỉnh sửa thông tin nhân sự và ghi chú, đồng thời chuyển trạng thái của lịch hẹn qua các bước trong quy trình đánh giá,
**để** theo dõi tiến trình kiểm tra đầu vào của học viên và cập nhật kết quả kịp thời.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập, không phụ thuộc US-BT01/02/04/05.
> - [x] **N**egotiable — Bố cục khu vực, vị trí nút thao tác có thể thương lượng.
> - [x] **V**aluable — Giúp Sale/Quản lý theo dõi tiến trình và cập nhật kết quả cho từng booking.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-DETAIL-01]:** `NẾU` lịch hẹn ở trạng thái kết thúc (Hoàn thành, Đã hủy, Không đạt, Đã có kết quả), `THÌ` ẩn toàn bộ nút chuyển trạng thái; chỉ hiển thị nút Đóng.
2. **[RULE-DETAIL-02]:** Các thao tác chỉnh sửa thông tin (Trình độ, Giáo viên, Ghi chú) được thực hiện trực tiếp (Inline Edit) và lưu ngay lập tức, không có chế độ chỉnh sửa (Edit Mode) toàn cục.
3. **[RULE-DETAIL-03]:** Ghi chú hoạt động theo mô hình tích lũy — chỉ thêm mới, không cho phép xóa hay ghi đè nội dung cũ. Hệ thống tự động ghi tên người tạo và thời gian.
4. **[RULE-DETAIL-04]:** Hộp chọn Trình độ đầu vào và Mức độ chi tiết luôn cho phép thao tác trực tiếp. Hệ thống lưu ngay khi thay đổi.
5. **[RULE-DETAIL-05]:** Hộp chọn Mức độ chi tiết bị vô hiệu hóa `NẾU` chưa chọn Trình độ đầu vào. Khi đổi Trình độ, Mức độ chi tiết tự động đặt lại về "Chưa chọn".
6. **[RULE-DETAIL-06]:** `NẾU` bấm nút "Bắt đầu đánh giá", `THÌ` hệ thống tự động chuyển trạng thái thành "Đang đánh giá". `NẾU` bấm nút "Mở đánh giá", mở màn hình Đánh giá Năng lực (US-BT04).
7. **[RULE-DETAIL-07]:** Bấm nút "Đổi" giáo viên sẽ mở hộp thoại phụ (Popup) chứa danh sách giáo viên. Danh sách này bắt buộc phải được lọc theo Cơ sở (Trường) của booking hiện tại.

---

## 3. Cấu trúc Giao diện & Dữ liệu

**Bố cục:** Cửa sổ 2 cột (Tóm tắt 35% / Chi tiết 65%), mở từ danh sách tổng quan (US-BT01). Trên điện thoại chuyển thành 1 cột.

### 3.1. Tiêu đề & Nút thao tác

| Nút | Loại | Logic chuyển trạng thái | Điều kiện |
|-----|------|-------------------------|-----------|
| Bắt đầu đánh giá | Nút viền (Outline) | Cập nhật trạng thái → "Đang đánh giá". | `NẾU` trạng thái ∈ {Đã đặt lịch}. |
| Không đạt | Nút viền (Outline) | Cập nhật trạng thái → "Không đạt". | `NẾU` trạng thái ∈ {Đang đánh giá}. |
| Hoàn tất | Nút màu nền (Solid) | Cập nhật trạng thái → "Hoàn thành". | `NẾU` trạng thái ∈ {Đang đánh giá}. |
| Hủy lịch test | Nút màu cảnh báo (Destructive) | Hộp thoại xác nhận → "Đã hủy". | `NẾU` trạng thái ∉ {Hoàn thành, Đã hủy, Không đạt}. |
| Mở đánh giá | Nút màu nền (Solid) | Mở hộp thoại Đánh giá Năng lực (US-BT04). | `NẾU` môn học = English. |

### 3.2. Cột trái — Tóm tắt (Chỉ xem)

| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Ảnh đại diện | Khung tròn lớn | Chữ cái đầu tên học viên | Nền màu nổi bật, viền trắng. |
| Tên học viên | Chữ đậm lớn | Họ tên đầy đủ | |
| Môn học | Nhãn thông tin | Tên môn (Tiếng Anh / Toán) | |
| Trạng thái | Nhãn màu | Trạng thái hiện tại | Theo bộ màu chuẩn. |
| Thẻ Lịch hẹn | Khối viền | Thời gian + Chương trình + Cơ sở / Phòng | 3 dòng thông tin. |

### 3.3. Cột phải — Chi tiết

#### Khu vực Gia đình

| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Tiêu đề | Nhãn + Biểu tượng | "GIA ĐÌNH" | |
| Danh sách thành viên | Khối ngang | Mỗi người: Ảnh đại diện + Tên + SĐT ẩn một phần | Di chuột: hiện nút Gọi điện + Sao chép SĐT. |

#### Khu vực Nhân sự

| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Tiêu đề | Nhãn + Biểu tượng | "NHÂN SỰ" | |
| Người tạo lịch | Khối thông tin | Ảnh đại diện + Nhãn + Tên | Mặc định "Quản trị viên" nếu không xác định. |
| Giáo viên Đánh giá | Khối thông tin + Chỉnh sửa nhanh | Đã có GV: tên + nút "Đổi". Chưa có: hộp chọn + nút "Chọn". | Bấm "Đổi" → mở hộp thoại chọn GV ([RULE-DETAIL-07]). |

#### Khu vực Kết quả Đánh giá

| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Tiêu đề | Nhãn + Biểu tượng | "KẾT QUẢ ĐÁNH GIÁ" | |
| Trình độ đầu vào | Danh sách thả xuống | Phân loại trình độ (Pre-Kindie → Level 3B) | Luôn thao tác được, lưu ngay ([RULE-DETAIL-04]). |
| Mức độ chi tiết | Danh sách thả xuống | A1, A, B, C — phụ thuộc Trình độ đã chọn | Vô hiệu nếu chưa chọn Trình độ ([RULE-DETAIL-05]). |
| Lộ trình | Khối thống kê nhỏ | Kết quả lộ trình học tập đề xuất | Chỉ xem. Lấy từ đánh giá GV. Trống: "—". |

#### Khu vực Kết quả (Liên kết)

Chỉ hiển thị khi booking đã có kết quả (từ iPad hoặc do giáo viên chấm).

| Thông tin | Loại | Trường | Ghi chú |
|-----------|------|--------|---------|
| Kết quả từ iPad | Nút liên kết | Mở bài làm trên thẻ trình duyệt mới | Lấy từ `resultLink` của hệ thống. |
| Kết quả đánh giá (Giáo viên) | Nút liên kết | Mở bảng chấm điểm chi tiết (US-BT04) ở chế độ xem | |

**Mối quan hệ Trình độ — Mức độ chi tiết:**

| Trình độ | Lựa chọn Mức độ chi tiết |
|----------|--------------------------|
| Chưa chọn | (Vô hiệu hóa) |
| Pre-Kindie, Kindie 1–3 | A1, A, B, C |
| Pre-Level 0 | A1, A, B, C |
| Level 1A — Level 3B | A1, A, B, C |

### 3.4. Lịch sử Ghi chú

| Thành phần | Loại | Dữ liệu | Hoạt động |
|------------|------|----------|-----------|
| Dòng thời gian | Danh sách dọc | Nội dung + Người tạo + Thời gian | Mới nhất trên cùng. Trống: chữ mờ "Không có ghi chú nào." |
| Ô nhập mới | Ô văn bản + Nút gửi | Thêm vào lịch sử | Ghim cố định cuối danh sách. Luôn thao tác được ([RULE-DETAIL-04]). |

### 3.6. Sơ đồ chuyển đổi Trạng thái

```
                    ┌─────────────────────┐
                    │    Đã đặt lịch       │
                    │ (Chờ kiểm tra)       │
                    └─────────┬───────────┘
                              │
               ┌──────────────┼──────────────┐
               │              │              │
               ▼              │              ▼
    ┌──────────────────┐      │     ┌─────────────┐
    │  Đang đánh giá   │      │     │   Đã hủy     │
    │  (Đang làm bài)  │      │     └─────────────┘
    └────────┬─────────┘      │
             │                │
      ┌──────┼──────┐        │
      │      │      │        │
      ▼      ▼      ▼        │
 Hoàn thành  Không   Đã hủy   │
             đạt              │
                              │
  Trạng thái phụ (Phân biệt):  │
  ┌───────────────────────┐   │
  │ Đã phỏng vấn xong     │───┘
  │ Đã làm bài test xong  │
  └───────────────────────┘
```

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Lịch hẹn không có danh sách gia đình | Fallback: Lấy thông tin phụ huynh (familyName, phone) từ đặt lịch gốc. Nút gọi/sao chép vẫn hoạt động. |
| 4.2 | Lịch hẹn chưa có kết quả đánh giá | Trình độ: "Chưa chọn", Mức độ chi tiết: vô hiệu, Lộ trình: "—". Không hiển thị khu vực Liên kết Kết quả. |
| 4.3 | Mất thông tin người tạo/vận hành | Thẻ "Người tạo lịch" hiển thị "Quản trị viên hệ thống". |
| 4.4 | Chưa phân công giáo viên | Thẻ GV hiển thị nút "Chọn". Ảnh đại diện: dấu "?". |
| 4.5 | Lịch hẹn ở trạng thái kết thúc | Chỉ hiển thị nút Đóng ([RULE-DETAIL-01]). |
| 4.6 | Không có dữ liệu thời gian kiểm tra | Hiển thị "—". Nếu chỉ có ngày: hiển thị ngày, bỏ trống khung giờ. |
| 4.7 | Đã chọn Trình độ, sau đó đổi sang Trình độ khác | Mức độ chi tiết tự đặt lại về "Chưa chọn" ([RULE-DETAIL-05]). |
| 4.8 | Đổi Trình độ về "Chưa chọn" | Mức độ chi tiết bị vô hiệu hóa + xóa dữ liệu ([RULE-DETAIL-05]). |
| 4.9 | Lưu ghi chú trống | Hệ thống không cho phép — nút lưu bị vô hiệu hoặc chặn ngầm. |
| 4.10 | Lịch sử ghi chú quá dài | Khu vực ghi chú có thanh cuộn riêng. Ô nhập mới ghim cố định phía dưới. |
| 4.11 | Nhiều nhân viên cùng thêm ghi chú | Ghi nhận chính xác tên + thời gian từng mốc. Dữ liệu nối tiếp, không ghi đè. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Giao diện chi tiết là tầng điều phối — chỉ hiển thị và ghép nối các khu vực con, không ôm đồm xử lý logic phức tạp.
- Tất cả nhãn trạng thái bắt buộc lấy màu từ hệ thống tập trung (`statusColors.ts`).
- Mọi hành động nguy hiểm (Hủy lịch, chuyển trạng thái kết thúc) bắt buộc đi qua hệ thống Xác nhận (`ConfirmDialog`).
- Kiểm tra phân quyền trước khi hiển thị nút thao tác.
- Trạng thái ảo ("Đã phỏng vấn", "Đã kiểm tra") xử lý bằng cờ riêng, không phải trạng thái chính.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** thêm khu vực thông tin hoặc nút thao tác ngoài danh sách đã định nghĩa ở mục 3.
- **KHÔNG** cho phép chuyển trạng thái ngoài sơ đồ vòng đời ở mục 3.6.
- **KHÔNG** bỏ qua bước xác nhận cho hành động có tính rủi ro cao.
- **KHÔNG** bỏ qua các trạng thái Trống / Đang tải / Lỗi trong thiết kế luồng.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Nút trạng thái | Thử ở mỗi trạng thái (Chờ, Đang đánh giá, Kết thúc) | Chỉ nút hợp lệ xuất hiện theo bảng 3.1. |
| V-02 | Chỉnh sửa tại chỗ (Inline Edit) | Thao tác đổi Giáo viên, Trình độ | Dữ liệu được cập nhật ngay hoặc qua hộp thoại phụ, không cần nút Lưu toàn cục. |
| V-03 | Lịch sử ghi chú | Thêm bản ghi mới | Nằm đúng thứ tự thời gian, hiển thị rõ tên và giờ. Ghi chú cũ không mất. |
| V-04 | Trình độ — Mức độ liên kết | Chọn/đổi/xóa Trình độ | Mức độ chi tiết phản ứng đúng theo bảng 3.3. |
| V-05 | Lọc Giáo viên theo cơ sở | Mở hộp thoại chọn GV | Chỉ hiển thị GV thuộc về trường của booking hiện tại. |
| V-06 | Giao diện co giãn | Thu hẹp màn hình | Chuyển từ 2 cột thành 1 cột mượt mà. |
| V-07 | Nhãn trạng thái | Kiểm tra bằng mắt | Tất cả nhãn lấy màu từ hệ thống tập trung. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bố cục 2 cột | So với mẫu thiết kế §4.3 | 2 cột trên máy tính, 1 cột trên điện thoại. |
| AC-02 | Nút đúng logic trạng thái | Bấm ở từng trạng thái | Chỉ nút hợp lệ xuất hiện theo bảng 3.1. Trạng thái kết thúc: chỉ Đóng. |
| AC-03 | Chỉnh sửa tại chỗ hoạt động | Đổi dữ liệu | Đổi cấp độ (Level/Sublevel) lưu ngay. Mở đúng popup chọn GV. |
| AC-04 | Khu vực Gia đình (Fallback) | Kiểm tra dữ liệu gia đình | Nếu trống, lấy tự động từ người đặt lịch gốc. SĐT ẩn một phần. |
| AC-05 | Đổi Giáo viên | Bấm "Đổi" / "Chọn" | Mở hộp tìm kiếm giáo viên và danh sách phải được lọc theo đúng cơ sở của lịch hẹn. |
| AC-06 | Trình độ — Mức độ liên kết | Thao tác chọn/đổi Trình độ | Mức độ phản ứng đúng. Đổi Trình độ → Mức độ tự đặt lại. |
| AC-07 | Hiển thị liên kết kết quả | Mở một lịch hẹn đã có kết quả | Phải hiển thị "Kết quả từ iPad" hoặc "Kết quả đánh giá (Giáo viên)". |
| AC-08 | Nút liên kết chức năng | Bấm Mở đánh giá | Mở đúng màn hình đánh giá tương ứng. |
| AC-09 | Lịch sử ghi chú | Thêm ghi chú mới | Có tab Ghi chú và Lịch sử, ô nhập độc lập, ghi chú cũ không mất. |
| AC-10 | Cập nhật tức thời | Lưu thay đổi hoặc chuyển trạng thái | Danh sách bên ngoài cập nhật ngay, không cần tải lại trang. |
| AC-11 | Nhãn trạng thái đúng màu | Kiểm tra bằng mắt | Tất cả lấy màu từ hệ thống tập trung, không gán cố định. |
