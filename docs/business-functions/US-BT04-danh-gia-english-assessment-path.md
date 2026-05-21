---
id: US-BT04
title: "Đánh giá English Assessment Path"
bf: BF-ENR-01
domain: CAP-ADM
status: draft
tags: [enrollment, booking-test, assessment, form]
---

# US-BT04: Đánh giá English Assessment Path

> **Tham chiếu:** BF-ENR-01 · `[POLICY-DS-03]` · Giao diện Mẫu §4.4 (Biểu mẫu)

## 1. Yêu cầu Người dùng (User Story)

**Là một** giáo viên / nhân viên Tư vấn,
**tôi muốn** đánh giá toàn diện năng lực tiếng Anh của học viên thông qua hai kênh: bài test tự động (Listening-Writing-Reading) và giáo viên chấm trực tiếp (Speaking),
**để** có kết quả đầy đủ cả 4 kỹ năng, xác định trình độ chính xác và xếp lớp phù hợp.

> **Kiểm tra chất lượng (INVEST):**
> - [x] **I**ndependent — Triển khai độc lập, không phụ thuộc US-BT01/02/03/05.
> - [x] **N**egotiable — Bố cục biểu mẫu, số tiêu chí nhận xét có thể thương lượng.
> - [x] **V**aluable — Cung cấp kết quả đánh giá đầu vào chính xác cho xếp lớp.
> - [x] **E**stimable — Đủ rõ để ước lượng công sức.
> - [x] **S**mall — Hoàn thành trong 1 vòng phát triển.
> - [x] **T**estable — Có tiêu chí nghiệm thu ở mục 7.

---

## 2. Quy tắc Nghiệp vụ (Business Rules)

1. **[RULE-ASSESS-01] Chỉ áp dụng môn English:** Hộp thoại đánh giá chỉ mở được cho booking môn English. Booking môn Math không có chức năng này.
2. **[RULE-ASSESS-02] Hai kênh đánh giá độc lập:** Bài test tự động (LWR) và giáo viên chấm Speaking hoạt động độc lập về thời gian — có thể diễn ra đồng thời hoặc trước/sau nhau. Kết quả một kênh không ghi đè kênh kia.
3. **[RULE-ASSESS-03] Tự động tạo bài test:** Khi booking môn English được tạo thành công (US-BT02), hệ thống tự động tạo bài test cho học viên — không cần thao tác thủ công. Kết quả LWR tự động cập nhật vào booking khi học viên hoàn thành.
4. **[RULE-ASSESS-04] Điểm yếu tối đa 3:** Giáo viên chọn tối đa 3 điểm yếu. Đạt 3 → các ô chưa chọn bị vô hiệu. Bỏ chọn → kích hoạt lại.
5. **[RULE-ASSESS-05] Không ghi đè rỗng:** `NẾU` giáo viên không chấm câu nào (tất cả trống) `THÌ` giữ nguyên điểm Speaking cũ khi lưu — không ghi đè bằng giá trị rỗng.
6. **[RULE-ASSESS-06] Khôi phục dữ liệu:** `NẾU` booking đã có đánh giá `THÌ` biểu mẫu tự khôi phục toàn bộ dữ liệu đã lưu khi mở lại.
7. **[RULE-ASSESS-07] Loại test theo độ tuổi:** Hệ thống gợi ý loại test dựa trên độ tuổi học viên (Pre-Starters ≤6, Starters >6–8, Movers >8–10, Flyers >10). Mặc định: Pre-Starters.

---

## 3. Cấu trúc Các trường nhập liệu

Hộp thoại đánh giá gồm 3 phần: thông tin học viên (đầu), biểu mẫu đánh giá (thân), nút hành động (chân). Có thể mở từ: nút "Đánh giá" khi di chuột trên bảng (US-BT01), cột "Path" trên bảng, hoặc nút trong hộp thoại chi tiết (US-BT03).

### 3.1. Thông tin học viên (Chỉ xem)

**Bố cục:** Lưới 2 cột trên điện thoại, 4 cột trên màn hình rộng.

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Ảnh đại diện | Khung tròn | — | Chữ cái đầu tên | Kích thước lớn, nền nhạt. |
| Tên học viên | Nhãn + Giá trị | — | Tên từ booking | Chỉ xem. |
| Năm sinh | Nhãn + Giá trị | — | Năm sinh từ hồ sơ | Tìm hồ sơ khớp tên → đọc năm sinh. Không tìm được: "N/A". |
| Grade | Nhãn + Giá trị | — | Level hiện tại | Nếu trống: "N/A". |
| Số điện thoại | Nhãn + Giá trị | — | SĐT từ booking | Nếu trống: "N/A". |

### 3.2. Cấu hình đánh giá

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Người đánh giá | Danh sách tìm kiếm | Không | Giáo viên | Hiển thị tên + chức danh. Hỗ trợ gõ tìm. |
| Loại test | Danh sách thả xuống | Có | Loại test | 4 lựa chọn (xem bảng dưới). Mặc định: Pre-Starters. |
| Thời gian test | Chỉ đọc | — | Thời gian từ booking | Nếu trống: "N/A". |

**4 loại test:**

| Tên hiển thị | Phạm vi tuổi |
|-------------|--------------|
| Pre-Starters | ≤ 6 tuổi |
| Starters | > 6 và ≤ 8 tuổi |
| Movers | > 8 và ≤ 10 tuổi |
| Flyers | > 10 tuổi |

### 3.3. Tab đánh giá

| Thành phần | Mô tả |
|------------|-------|
| Tab "Form 2025" | Biểu mẫu đánh giá chính. Mặc định được chọn. |
| Tab "Old Form" | Giữ chỗ cho biểu mẫu cũ. Hiển thị thông báo "Chưa khả dụng". |
| Nhãn loại test | Hiển thị tên loại test đang chọn (vd: "Pre-Starters (≤6)"). |

### 3.4. Bảng chấm điểm Speaking (Form 2025)

Bảng lưới 8 câu hỏi × 3 mức điểm. Mỗi câu hỏi chỉ chọn 1 giá trị: 0, 0.5, hoặc 1.

| Tên trường | Loại hiển thị | Bắt buộc | Trường dữ liệu | Ghi chú & Quy tắc |
|------------|---------------|----------|----------------|-------------------|
| Câu 1–8 | Nút chọn đơn (0 / 0.5 / 1) | Không | Điểm từng câu | Tiêu đề cột: số 1–8, in đậm, căn giữa. 3 hàng: "0 point", "0.5 point", "1 point". |
| Tổng điểm | Tự tính (chỉ xem) | — | Tổng 8 câu | Hiển thị "{tổng} / 8". |
| Speaking Level | Tự tính (chỉ xem) | — | Level từ tổng điểm | Xếp hạng theo bảng dưới. |

**Bảng xếp hạng Speaking Level:**

| Tổng điểm | Level | Ý nghĩa |
|-----------|-------|---------|
| Chưa chấm | Pending | Chưa đánh giá. |
| 0 — 2 | Needs support | Cần hỗ trợ thêm. |
| 2.5 — 4 | Developing | Đang phát triển. |
| 4.5 — 6 | Confident | Tự tin giao tiếp. |
| 6.5 — 8 | Advanced | Nâng cao. |

### 3.5. Nhận xét của giáo viên (Form 2025)

Biểu mẫu đánh giá định tính gồm 7 tiêu chí. Mỗi tiêu chí có 1 câu hỏi và 2 lựa chọn (tích cực / tiêu cực). Bố cục 2 cột — cột trái: câu hỏi, cột phải: 2 lựa chọn xếp dọc. Trên điện thoại: chuyển thành 1 cột.

| # | Tiêu chí | Câu hỏi | Tích cực | Tiêu cực |
|---|----------|---------|----------|----------|
| 1 | Sự tự tin | Học viên trả lời câu hỏi của giáo viên theo cách: | Tự tin trong giao tiếp | Thiếu tự tin, do dự khi nói |
| 2 | Từ vựng | Sử dụng từ vựng: | Dùng từ vựng chính xác | Thiếu từ khóa quan trọng |
| 3 | Cấu trúc câu | Xây dựng câu: | Nói câu đầy đủ, rõ ràng | Chỉ dùng từ đơn |
| 4 | Ngữ điệu | Phát âm và trọng âm: | Ngữ điệu tự nhiên, trọng âm đúng | Ngữ điệu và trọng âm sai |
| 5 | Độ trôi chảy | Độ lưu loát: | Nói trôi chảy, phản hồi nhanh | Nói ngập ngừng, phản hồi chậm |
| 6 | Diễn đạt ý tưởng | Diễn đạt ý tưởng: | Có thể diễn đạt bằng tiếng Anh | Trộn tiếng Anh với tiếng Việt |
| 7 | Nhận diện từ | Nhận diện từ: | Đánh vần và nhận diện từ tốt | Nhận diện từ kém |

### 3.6. Đánh dấu điểm yếu (Form 2025)

Tiêu đề: "Highlight weaknesses". Hiển thị bộ đếm "{số}/3 đã chọn". Bố cục 2 cột, mỗi mục là ô chọn + nhãn. **Tối đa chọn 3** (xem RULE-ASSESS-04).

| # | Nhãn điểm yếu |
|---|---------------|
| 1 | Thiếu tự tin, do dự khi nói |
| 2 | Thiếu từ khóa quan trọng |
| 3 | Chỉ dùng từ đơn |
| 4 | Phát âm sai, thiếu âm cuối |
| 5 | Ngữ điệu và trọng âm sai |
| 6 | Nói ngập ngừng, phản hồi chậm |
| 7 | Trộn tiếng Anh với tiếng Việt |
| 8 | Nhận diện từ kém |

### 3.7. Dữ liệu lưu khi cập nhật

Khi bấm "Cập nhật", hệ thống lưu toàn bộ:
- Người đánh giá (mã + tên hiển thị)
- Loại test đã chọn
- Tab đang chọn
- Điểm từng câu (8 câu)
- Tổng điểm (0–8)
- Speaking Level (tự tính)
- Nhận xét theo 7 tiêu chí (tích cực / tiêu cực)
- Danh sách điểm yếu đã chọn (tối đa 3)

Sau khi lưu: điểm Speaking cập nhật dạng "{tổng}/8" (bỏ số thập phân nếu là số nguyên, vd: "6/8" thay vì "6.0/8").

### 3.8. Ví dụ Dữ liệu mẫu

| Tình huống | Dữ liệu đầu vào | Kết quả mong đợi |
|------------|-----------------|-------------------|
| Chấm đủ 8 câu | 8 câu: 1, 0.5, 1, 0.5, 1, 1, 0.5, 1 = 6.5 | Tổng: "6.5/8". Level: "Advanced". Lưu thành công. |
| Chấm 1 phần (3 câu) | 3 câu chấm, 5 câu trống (=0) | Tổng tính từ 3 câu. Các câu trống = 0. |
| Không chấm câu nào | Tất cả trống | Tổng = 0, Level = "Pending". Lưu: giữ nguyên điểm cũ. |
| Chọn 3 điểm yếu | Chọn #1, #3, #5 | Bộ đếm "3/3". Ô #2, #4, #6, #7, #8 bị vô hiệu. |

### 3.9. Nút hành động

| Nút | Loại hiển thị | Logic xử lý |
|-----|---------------|-------------|
| Hủy | Nút viền nhạt | Đóng hộp thoại, không lưu. Dữ liệu chưa lưu bị mất. |
| Cập nhật | Nút màu nhấn | Lưu toàn bộ đánh giá → Đóng hộp thoại → Cập nhật kết quả trên bảng. |

---

## 4. Xử lý Ngoại lệ

| # | Tình huống | Cách xử lý |
|---|-----------|------------|
| 4.1 | Mở hộp thoại cho booking môn Math | Không mở. Cột Path hiển thị "—" thay vì liên kết. |
| 4.2 | Chỉ chấm một vài câu (không đủ 8) | Tổng tính từ các câu đã chấm. Các câu chưa chấm = 0. |
| 4.3 | Chọn điểm yếu thứ 4 | Không cho phép — ô chọn thứ 4 bị vô hiệu. Bộ đếm "3/3 đã chọn". |
| 4.4 | Bỏ chọn điểm yếu khi đã đạt tối đa | Các ô chọn khác được kích hoạt lại. Bộ đếm giảm. |
| 4.5 | Mở lại cho booking đã có đánh giá | Biểu mẫu tự khôi phục toàn bộ dữ liệu đã lưu. Cho phép chỉnh sửa và lưu lại. |
| 4.6 | Mở cho booking chưa có đánh giá | Biểu mẫu trống — tất cả giá trị mặc định. |
| 4.7 | Đổi booking trong khi hộp thoại đang mở | Biểu mẫu đặt lại theo booking mới. |
| 4.8 | Hồ sơ không khớp tên học viên | Năm sinh hiển thị "N/A". SĐT lấy từ booking. Hệ thống so khớp bỏ dấu. |
| 4.9 | Danh sách người đánh giá trống | Hiển thị gợi ý, không có mục nào. Vẫn cho phép lưu (không bắt buộc). |
| 4.10 | Bấm "Hủy" sau khi đã chấm điểm | Đóng, không lưu. Mở lại: nếu chưa có đánh giá cũ → biểu mẫu trống. |
| 4.11 | Trên điện thoại | Các khu vực chuyển sang xếp dọc. Bảng chấm điểm cuộn ngang. |
| 4.12 | Hệ thống tạo bài test tự động thất bại | Booking vẫn được tạo thành công. Cột LWR hiển thị "—". |
| 4.13 | Học viên không hoàn thành bài test (bỏ dở) | Không có kết quả. Cột LWR giữ "—". Giáo viên vẫn chấm Speaking được. |
| 4.14 | Kết quả hệ thống trả trễ (sau khi GV đã chấm) | LWR cập nhật bổ sung, không ghi đè Speaking. Hai kênh độc lập. |
| 4.15 | Kết quả trả về cho booking đã hủy | Hệ thống vẫn nhận và lưu. Trạng thái booking không thay đổi. |

---

## 5. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tách biệt hoàn toàn phần xử lý giao diện và phần kiểm tra ràng buộc dữ liệu (số điểm yếu tối đa, quy tắc không ghi đè rỗng).
- Kiểm tra tính hợp lệ nghiệp vụ ngay khi người dùng thao tác: bộ đếm điểm yếu, tổng điểm, Speaking Level cập nhật tức thời.
- Nhãn trạng thái (Speaking Level) bắt buộc lấy màu từ bộ quy tắc trạng thái chuẩn (`statusColors.ts`).
- Bảng chấm điểm nên tách thành thành phần riêng (bảng lưới 8×3).
- Dữ liệu loại test, tiêu chí nhận xét, danh sách điểm yếu nên khai báo dạng danh sách cấu hình, không viết cố định trong giao diện.

### Tham chiếu chéo — Hiển thị kết quả trên các màn hình khác

Kết quả đánh giá từ US-BT04 được hiển thị tại:

| Màn hình | Cột / Khu vực | Nguồn | Mô tả |
|----------|---------------|-------|-------|
| Bảng danh sách (US-BT01) | Cột Speaking | Phần B — GV chấm | Nhãn "GV: {điểm}" nền cam. Trống: "—". |
| Bảng danh sách (US-BT01) | Cột LWR | Phần A — Tự động | Điểm LWR (vd: "27/40"). Trống: "—". |
| Bảng danh sách (US-BT01) | Cột Path | Phần B — GV chấm | Liên kết mở hộp thoại đánh giá. |
| Hộp thoại chi tiết (US-BT03) | Thẻ kết quả | Phần A + B | Level, Lộ trình, Speaking, LWR. |

Khi chỉ có 1 kênh có kết quả, cột còn lại hiển thị "—" mà không ảnh hưởng cột kia.

### ⛔ Hàng rào An toàn (Guardrails)

- **KHÔNG** thêm trường nhập liệu hoặc tiêu chí nhận xét ngoài danh sách ở mục 3.
- **KHÔNG** thay đổi bảng xếp hạng Speaking Level ở mục 3.4 mà chưa được phê duyệt.
- **KHÔNG** cho phép mở hộp thoại đánh giá cho booking môn Math.
- **KHÔNG** ghi đè kết quả LWR khi cập nhật Speaking và ngược lại.

---

## 6. Kế hoạch Tự kiểm tra (Self-Verification)

| # | Hạng mục | Cách kiểm tra | Tiêu chuẩn Đạt |
|---|----------|---------------|-----------------|
| V-01 | Bảng chấm điểm | Chấm 8 câu, kiểm tra tổng | Tổng đúng, Speaking Level đúng theo bảng xếp hạng. |
| V-02 | Điểm yếu | Chọn 3 điểm yếu, thử chọn thứ 4 | Ô thứ 4 bị vô hiệu. Bỏ chọn → kích hoạt lại. |
| V-03 | Khôi phục dữ liệu | Lưu đánh giá, đóng, mở lại | Toàn bộ dữ liệu khôi phục đúng. |
| V-04 | Không ghi đè rỗng | Không chấm câu nào, bấm Cập nhật | Điểm Speaking cũ giữ nguyên. |
| V-05 | Hai kênh độc lập | Chấm Speaking trước, LWR cập nhật sau | Mỗi kênh cập nhật độc lập, không ghi đè kênh kia. |
| V-06 | Chỉ mở cho English | Thử mở cho booking Math | Không mở được. Cột Path hiển thị "—". |
| V-07 | Nhãn trạng thái | Kiểm tra Speaking Level | Không có màu gán cố định. Lấy từ hệ thống tập trung. |
| V-08 | Giao diện co giãn | Thu hẹp màn hình | Chuyển xếp dọc. Bảng chấm điểm cuộn ngang. |

---

## 7. Tiêu chí Nghiệm thu (SMART Acceptance Criteria)

| # | Tiêu chí (Specific) | Cách đo (Measurable) | Kết quả mong đợi |
|---|---------------------|----------------------|-------------------|
| AC-01 | Bố cục chuẩn biểu mẫu | So với mẫu thiết kế §4.4 | Thông tin học viên → Cấu hình → Bảng chấm → Nhận xét → Điểm yếu → Nút hành động. |
| AC-02 | Bảng chấm điểm chính xác | Chấm 8 câu với các tổ hợp điểm khác nhau | Tổng đúng, Speaking Level đúng theo bảng xếp hạng. |
| AC-03 | Nhận xét 7 tiêu chí | Chọn lần lượt từng tiêu chí | Mỗi tiêu chí 2 lựa chọn, chọn độc lập. |
| AC-04 | Điểm yếu tối đa 3 | Chọn 3, thử chọn thứ 4 | Ô thứ 4 vô hiệu. Bộ đếm "3/3". Bỏ chọn → kích hoạt lại. |
| AC-05 | Lưu đánh giá | Chấm đủ, bấm Cập nhật | Hộp thoại đóng, bảng cập nhật cột Speaking đúng giá trị. |
| AC-06 | Khôi phục khi mở lại | Lưu → Đóng → Mở lại | Toàn bộ dữ liệu đã lưu được khôi phục chính xác. |
| AC-07 | Hai kênh độc lập | Kiểm tra cột Speaking và LWR trên bảng | Mỗi kênh cập nhật riêng. Khi thiếu 1 kênh: cột kia hiển thị "—". |
| AC-08 | Chỉ English | Thử mở cho booking Math | Không mở. Cột Path hiển thị "—". |
| AC-09 | Giao diện co giãn | Thu hẹp, mở rộng màn hình | 2 cột trên máy tính, 1 cột trên điện thoại. Bảng chấm cuộn ngang. |
| AC-10 | Nhãn trạng thái đúng màu | Kiểm tra Speaking Level | Lấy màu từ hệ thống tập trung, không gán cố định. |
