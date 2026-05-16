# US-BT04: Đánh giá English Assessment Path

## 1. User Story

**Là một** giáo viên / nhân viên Sale,
**tôi muốn** đánh giá toàn diện năng lực tiếng Anh của học viên thông qua hai kênh: **bài test trên iPad (LMS)** đánh giá Listening-Writing-Reading và **giáo viên chấm trực tiếp** đánh giá Speaking,
**để** có kết quả đầy đủ cả 4 kỹ năng, xác định trình độ chính xác và xếp lớp phù hợp cho học viên.

---

## 4. Mô tả chi tiết

Quy trình đánh giá đầu vào môn English gồm **2 phần song song**, kết quả tổng hợp lại trên cùng 1 booking:

| Phần | Kênh đánh giá | Người thực hiện | Kết quả đầu ra |
|------|--------------|----------------|----------------|
| **A. Bài test iPad (LMS)** | Hệ thống tự động | Học viên tự làm bài trên iPad | Điểm LWR (Listening-Writing-Reading) |
| **B. Đánh giá Speaking (GV)** | Giáo viên chấm trực tiếp | Giáo viên quan sát + chấm qua modal | Điểm Speaking + Feedback + Weaknesses |

### Tổng quan luồng đánh giá

```
Booking được tạo (US-BT02)
    │
    ├──→ [A] Hệ thống tự động tạo bài test iPad trên LMS
    │         │
    │         ├── Học viên làm bài trên iPad tại cơ sở
    │         │
    │         └── LMS trả kết quả ──→ Cập nhật cột LWR Level trên bảng
    │                                  + testResult.lwr trong booking
    │
    └──→ [B] Giáo viên mở Assessment modal, chấm Speaking
              │
              └── GV chấm xong, click Update ──→ Cập nhật cột Speaking Level
                                                  + testResult.speaking trong booking
```

Hai phần A và B **độc lập về thời gian** — có thể diễn ra đồng thời hoặc trước/sau nhau. Kết quả hiển thị gộp trên cùng 1 dòng booking trong bảng (US-BT01) và trong detail modal (US-BT03).

---

### PHẦN A: Bài test iPad — LMS (tự động)

### 4.A1. Tự động tạo bài test khi booking được tạo

| Thành phần | Mô tả | Ghi chú |
|------------|-------|---------|
| Trigger | Khi booking được tạo thành công (US-BT02) với `subject === 'english'`, hệ thống tự động gọi LMS để tạo bài test cho học viên. | Không cần thao tác thủ công từ user. |
| Dữ liệu gửi sang LMS | Thông tin học viên (tên, ID), loại test (dựa trên program/level), cơ sở test, thời gian test. | LMS dùng thông tin này để chuẩn bị bài test trên iPad tại cơ sở tương ứng. |
| Trạng thái ban đầu | Cột LWR trên bảng hiển thị "—" (chưa có kết quả). `testResult.lwr` chưa có giá trị. | |

### 4.A2. Học viên làm bài test trên iPad

| Thành phần | Mô tả | Ghi chú |
|------------|-------|---------|
| Thiết bị | Học viên làm bài trực tiếp trên iPad tại cơ sở, thông qua ứng dụng LMS. | Nằm ngoài scope hệ thống Rinov3 — do LMS quản lý. |
| Nội dung test | Bài kiểm tra Listening, Writing, Reading (LWR) theo level/program đã chọn. | Cấu trúc bài test do LMS quy định. |

### 4.A3. LMS trả kết quả về Rinov3

| Thành phần | Mô tả | Ghi chú |
|------------|-------|---------|
| Cơ chế nhận kết quả | LMS gọi callback/webhook hoặc Rinov3 polling API của LMS để lấy kết quả khi học viên hoàn thành bài test. | Cơ chế tích hợp đã có sẵn. |
| Dữ liệu nhận về | Điểm LWR (vd: "27/40"), có thể kèm chi tiết từng phần (Listening, Writing, Reading). | |
| Cập nhật booking | Hệ thống tự động cập nhật `testResult.lwr` trên booking tương ứng. | Match booking bằng ID học viên + thời gian test. |
| Hiển thị trên bảng (US-BT01) | Cột **LWR Level** cập nhật từ "—" thành điểm thực (vd: "27/40"). | Cập nhật realtime hoặc sau khi refresh. |
| Hiển thị trên detail modal (US-BT03) | Thẻ kết quả **LWR** trong section "Kết quả đánh giá" cập nhật giá trị. | |

---

### PHẦN B: Đánh giá Speaking — Giáo viên (thủ công)

Modal đánh giá English Assessment Path chỉ áp dụng cho booking có `subject === 'english'`. Modal mở từ nhiều điểm truy cập: nút hover "Assessment" trên bảng, cột "Path" trên bảng, nút "Đánh giá GV" trong detail modal (US-BT03), hoặc tự động khi attendance chuyển sang `confirmed`.

Modal gồm 3 phần chính: thông tin học viên (header), form đánh giá (body), nút hành động (footer). Max-width 1152px (6xl), max-height body 78vh.

### 4.B1. Thông tin học viên (Header)

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Avatar | Div (rounded 2xl) | Chữ cái đầu tên học viên, font 2xl bold. Nền subtle. | 72x72px. |
| Tên học viên (Student) | Label + Value | Label "Student", value = `booking.childName`. | Grid layout: 2 cột trên SM, 4 cột trên XL. |
| Năm sinh (Birth year) | Label + Value | Label "Birth year", value lấy từ Profile Catalog: tìm profile match tên học viên, đọc field `dob` / `birthday` / `dateOfBirth`, lấy 4 ký tự đầu (năm). | Nếu không tìm được: hiển thị "N/A". Match tên bằng normalize NFD + lowercase. |
| Grade | Label + Value | Label "Grade", value = `booking.level` (level hiện tại). | Nếu trống: "N/A". |
| SĐT (Phone) | Label + Value | Label "Phone number", value = `booking.phone` hoặc từ profile. | Nếu trống: "N/A". |

### 4.B2. Meta — Cấu hình đánh giá

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Người đánh giá (Evaluator) | SearchableSingleSelect | Dropdown tìm kiếm, danh sách giáo viên. | Cùng nguồn với teacher options. Hiển thị tên + chức danh. |
| Loại test (Test type) | Select dropdown | 4 lựa chọn dựa trên độ tuổi học viên. | Mặc định "Pre-Starters". |
| Thời gian test | Read-only input | Hiển thị `booking.testTime`. Không chỉnh sửa. | Nếu trống: "N/A". |

**4 loại test:**

| ID | Tên hiển thị | Phạm vi tuổi |
|----|-------------|--------------|
| `preStarters` | Pre-Starters | <= 6 tuổi |
| `starters` | Starters | > 6 và <= 8 tuổi |
| `movers` | Movers | > 8 và <= 10 tuổi |
| `flyers` | Flyers | > 10 tuổi |

### 4.B3. Tab đánh giá

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tab "Form 2025" | Tab button | Form đánh giá chính đang sử dụng. Mặc định active. | Border + nền subtle khi active. |
| Tab "Old Form" | Tab button | Placeholder cho form cũ. Hiển thị text "Old form content is not available in this build yet.". | Chưa triển khai. |
| Badge loại test | Chip (info style) | Hiển thị tên loại test đang chọn (vd: "Pre-Starters (<=6)"). | Nằm bên phải, cùng hàng với tabs. |

### 4.B4. Bảng chấm điểm Speaking (Form 2025)

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Grid header | Row header | Cột đầu: rỗng. 8 cột tiếp theo: số 1-8 (đại diện 8 câu hỏi/tiêu chí). | Font 12px bold, text center. |
| Hàng "0 point" | Radio row | Cột đầu: label "0 point". 8 cột: radio button, value = 0. | Mỗi cột (câu hỏi) chỉ chọn được 1 giá trị: 0, 0.5, hoặc 1. |
| Hàng "0.5 point" | Radio row | Cột đầu: label "0.5 point". 8 cột: radio button, value = 0.5. | |
| Hàng "1 point" | Radio row | Cột đầu: label "1 point". 8 cột: radio button, value = 1. | |
| Tổng điểm (Score) | Computed label | Hiển thị "{totalScore} / 8". Tính realtime bằng tổng tất cả cột đã chọn. | Header bên trái: "Score". Format: bỏ `.0` nếu là số nguyên. |
| Speaking Level | Computed label | Xếp hạng tự động theo tổng điểm. | Header bên phải: "Speaking level". |

**Bảng xếp hạng Speaking Level:**

| Tổng điểm | Level | Ý nghĩa |
|-----------|-------|---------|
| Chưa chấm (0 cột) | Pending | Chưa đánh giá. |
| 0 — 2 | Needs support | Cần hỗ trợ thêm. |
| 2.5 — 4 | Developing | Đang phát triển. |
| 4.5 — 6 | Confident | Tự tin giao tiếp. |
| 6.5 — 8 | Advanced | Nâng cao. |

### 4.B5. Teacher Feedback (Form 2025)

Form đánh giá định tính gồm 7 tiêu chí. Mỗi tiêu chí có 1 câu hỏi (prompt) và 2 lựa chọn radio (positive / negative).

| # | Tiêu chí | Prompt | Positive | Negative |
|---|----------|--------|----------|----------|
| 1 | confidence | "The student answers the teacher's questions in the following way:" | Confident in communication | Lacks confidence, hesitant to speak |
| 2 | vocabulary | "Vocabulary usage:" | Uses key vocabulary appropriately | Misses important keywords |
| 3 | sentenceUse | "Sentence construction:" | Speaks in full, clear, coherent sentences | Only uses single words |
| 4 | intonation | "Pronunciation and stress:" | Natural intonation and correct stress | Incorrect intonation and stress |
| 5 | fluency | "Fluency:" | Speaks fluently with quick responses | Hesitant speech, slow responses |
| 6 | ideaExpression | "Idea expression:" | Able to express ideas in English | Mixes English with Vietnamese |
| 7 | wordRecognition | "Word recognition:" | Good spelling and word recognition | Poor word recognition |

**Layout:** Grid 2 cột — cột trái: prompt, cột phải: 2 radio options (positive/negative) xếp dọc trên 2 dòng. Trên mobile (< 1024px): chuyển thành 1 cột.

### 4.B6. Highlight Weaknesses (Form 2025)

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Tiêu đề | Section header | "Highlight weaknesses". Subtitle: "{count}/3 selected" (counter realtime). | |
| Danh sách weakness | Checkbox grid (2 cột) | 8 options, mỗi option là checkbox + label. | Tối đa chọn 3. Khi đạt 3: các checkbox chưa chọn bị disable + opacity 60%. |

**8 weakness options:**

| Key | Label |
|-----|-------|
| `lacksConfidence` | Lacks confidence, hesitant to speak |
| `missesKeywords` | Misses important keywords |
| `singleWords` | Only uses single words |
| `incorrectPronunciation` | Incorrect pronunciation, missing ending sounds |
| `incorrectIntonation` | Incorrect intonation and stress |
| `hesitantSpeech` | Hesitant speech, slow responses |
| `mixesLanguages` | Mixes English with Vietnamese |
| `poorWordRecognition` | Poor word recognition |

### 4.B7. Footer modal

| Thành phần | Loại control | Mô tả | Ghi chú |
|------------|-------------|-------|---------|
| Nút Cancel | Secondary button | Đóng modal, không lưu. | |
| Nút Update | Primary button | Lưu toàn bộ đánh giá và đóng modal. | |

### 4.B8. Payload khi lưu (Speaking Assessment)

Khi click "Update", emit `save` với payload:

| Field | Kiểu | Mô tả |
|-------|------|-------|
| `evaluatorId` | string | ID người đánh giá đã chọn. |
| `evaluatorLabel` | string | Tên hiển thị của người đánh giá. |
| `testType` | string | Loại test đã chọn (preStarters / starters / movers / flyers). |
| `selectedTab` | string | Tab đang active (form2025 / oldForm). |
| `scoreSelections` | object | Map câu hỏi → điểm. Vd: `{ "1": 1, "2": 0.5, "3": 0, ... }`. |
| `totalScore` | number | Tổng điểm (0 - 8). |
| `speakingLevel` | string | Level tự tính (Pending / Needs support / Developing / Confident / Advanced). |
| `feedbackAnswers` | object | Map tiêu chí → câu trả lời. Vd: `{ "confidence": "positive", "vocabulary": "negative", ... }`. |
| `weaknesses` | array | Danh sách key weakness đã chọn. Tối đa 3 phần tử. |

**Sau khi lưu:**
- Payload được lưu vào `booking.testResult.assessment`.
- `booking.testResult.speaking` cập nhật thành `"{totalScore}/8"` (format: bỏ `.0` nếu nguyên, vd: `6/8` thay vì `6.0/8`).
- Nếu `totalScore = 0` và không có score nào được chọn → giữ nguyên speaking cũ (không ghi đè bằng rỗng).

---

### PHẦN C: Tổng hợp kết quả trên Booking

Sau khi cả 2 phần hoàn thành, booking hiển thị đầy đủ kết quả:

### 4.C1. Hiển thị trên bảng danh sách (US-BT01)

| Cột | Nguồn dữ liệu | Mô tả |
|-----|---------------|-------|
| **Speaking** | Phần B — GV chấm | Badge "GV: {score}" (vd: "GV: 6.5/8"). Nền cam. Hiển thị "—" khi GV chưa chấm. |
| **LWR** | Phần A — LMS trả về | Điểm LWR (vd: "27/40"). Font bold. Hiển thị "—" khi chưa có kết quả từ LMS. |
| **Level** | Kết hợp A + B hoặc do GV chọn | Dropdown level, role `teacher` chỉnh được. |
| **Path** | Phần B — GV chấm (assessment path) | Link mở Assessment modal. Hiển thị path name nếu đã có. |

### 4.C2. Hiển thị trên Detail Modal (US-BT03)

| Thẻ kết quả | Nguồn | Mô tả |
|-------------|-------|-------|
| **Level** | GV chọn / hệ thống | Level xếp lớp hiện tại. |
| **Lộ trình (Path)** | Phần B | Assessment path từ GV đánh giá. |
| **Speaking** | Phần B — GV chấm | Điểm speaking (vd: "6.5/8"). Font mono, nền indigo. |
| **LWR** | Phần A — LMS trả về | Điểm LWR (vd: "27/40"). Font mono, nền indigo. |

### 4.C3. Mối quan hệ giữa 2 phần

| Tình huống | Hành vi |
|-----------|---------|
| Chỉ có kết quả LMS, GV chưa chấm | Cột LWR hiển thị điểm, cột Speaking hiển thị "—". Booking vẫn hợp lệ. |
| Chỉ có kết quả GV, LMS chưa trả | Cột Speaking hiển thị điểm, cột LWR hiển thị "—". Booking vẫn hợp lệ. |
| Cả 2 đều có kết quả | Hiển thị đầy đủ cả Speaking + LWR. Đây là trạng thái lý tưởng để xếp lớp. |
| Cả 2 đều chưa có | Cả 2 cột hiển thị "—". |

---

## 5. Corner Cases

| # | Case | Hành vi mong đợi |
|---|------|-------------------|
| 5.1 | Mở Assessment cho booking môn Math | Hàm `openAssessmentModal` kiểm tra `item.subject !== 'english'` → return, không mở modal. Nút Assessment trên bảng vẫn hiển thị cho Math nhưng click không có tác dụng. Cột Path hiển thị "-" thay vì link. |
| 5.2 | Không chấm câu nào (tất cả score rỗng) | `totalScore = 0`, `answeredCount = 0`. Speaking level = "Pending". Khi lưu: `speaking` chỉ cập nhật nếu `totalScore > 0` hoặc có giá trị, nếu không giữ speaking cũ. |
| 5.3 | Chỉ chấm một vài câu (không đủ 8) | Tổng điểm tính từ các câu đã chấm. Các câu chưa chấm = 0 trong tổng. `answeredCount` phản ánh số câu thực sự đã chọn. |
| 5.4 | Chọn weakness thứ 4 | Không cho phép — checkbox thứ 4 bị disable. Counter hiển thị "3/3 selected". Phải bỏ chọn 1 weakness trước khi chọn cái khác. |
| 5.5 | Bỏ chọn weakness khi đã đạt max | Checkbox được enable lại cho tất cả options chưa chọn. Counter giảm (vd: "2/3 selected"). |
| 5.6 | Mở lại modal cho booking đã có assessment | Form tự restore toàn bộ dữ liệu từ `initialValue`: evaluator, testType, tab, scores, feedback answers, weaknesses. Người dùng có thể chỉnh sửa và lưu lại. |
| 5.7 | Mở modal cho booking chưa có assessment (`initialValue = null`) | Form reset về mặc định: evaluator rỗng, testType = preStarters, tab = form2025, tất cả scores rỗng, tất cả feedback rỗng, weaknesses rỗng. |
| 5.8 | Đổi booking trong khi modal đang mở | Watch trên `[isOpen, booking.id, initialValue]` trigger `resetDraft()`. Form reset theo booking mới. |
| 5.9 | Profile Catalog không có profile match tên học viên | `bookingProfile = null`. Năm sinh hiển thị "N/A". SĐT fallback sang `booking.phone`. |
| 5.10 | Tên học viên có dấu tiếng Việt khác nhau trong booking vs profile | Hàm match normalize NFD + bỏ dấu + lowercase. "Phúc An" sẽ match "Phuc An". |
| 5.11 | Profile có `dob` không phải format year (vd: "2015-03-21") | Lấy 4 ký tự đầu = "2015". Regex `/^\d{4}$/` match → hiển thị "2015". |
| 5.12 | Profile có `dob` rỗng hoặc format lạ (vd: "N/A") | 4 ký tự đầu = "N/A " → regex không match → hiển thị "N/A". |
| 5.13 | Evaluator options rỗng (không có GV nào) | Dropdown hiển thị placeholder, không có option. Vẫn cho phép lưu assessment (evaluator không bắt buộc). |
| 5.14 | Click "Cancel" sau khi đã chấm điểm | Đóng modal, không lưu. Mở lại: nếu booking chưa có assessment → form reset rỗng (dữ liệu vừa nhập bị mất). Nếu đã có assessment trước đó → restore từ `initialValue`. |
| 5.15 | Responsive: màn hình < 768px | Summary section chuyển flex-direction column. Score grid có scroll ngang (min-width 42rem). Meta grid chuyển 1 cột. |
| 5.16 | Tạo booking môn Math — LMS có tạo bài test không? | Không. Bài test iPad/LMS chỉ tự động tạo khi `subject === 'english'`. Booking Math không trigger LMS. |
| 5.17 | LMS tạo bài test thất bại (network error, LMS down) | Booking vẫn được tạo thành công trên Rinov3. Cột LWR hiển thị "—". Cần cơ chế retry hoặc tạo lại bài test thủ công (ngoài scope UI hiện tại). |
| 5.18 | Học viên không hoàn thành bài test iPad (bỏ dở) | LMS không trả kết quả. Cột LWR giữ "—". GV vẫn có thể chấm Speaking độc lập. |
| 5.19 | LMS trả kết quả cho booking đã bị hủy (`cancelled`) | Hệ thống vẫn nhận và lưu kết quả LWR vào booking. Cột LWR cập nhật bình thường. Trạng thái booking không thay đổi. |
| 5.20 | LMS trả kết quả trễ (sau khi GV đã chấm Speaking xong) | Kết quả LWR cập nhật bổ sung, không ghi đè kết quả Speaking đã có. Hai phần độc lập nhau. |
| 5.21 | GV chấm Speaking trước khi học viên làm bài iPad | Cho phép. Speaking lưu bình thường. LWR cập nhật sau khi LMS trả về. |
| 5.22 | Booking bị hủy sau khi LMS đã tạo bài test | Bài test trên LMS cần được đồng bộ hủy (hoặc đánh dấu expired). Hiện tại nằm ngoài scope UI Rinov3. |

---

## 6. Acceptance Criteria

**Phần A — Bài test iPad / LMS:**

- [ ] Khi tạo booking English thành công, hệ thống tự động gọi LMS tạo bài test cho học viên (không cần thao tác thủ công).
- [ ] Sau khi học viên hoàn thành bài test trên iPad, kết quả LWR tự động cập nhật vào `testResult.lwr` trên booking.
- [ ] Cột LWR trên bảng (US-BT01) cập nhật từ "—" thành điểm thực (vd: "27/40") sau khi nhận kết quả.
- [ ] Thẻ LWR trong detail modal (US-BT03) hiển thị đúng điểm sau khi nhận kết quả.
- [ ] Kết quả LWR từ LMS không ghi đè kết quả Speaking từ GV (hai phần độc lập).
- [ ] Booking môn Math không trigger tạo bài test LMS.

**Phần B — Đánh giá Speaking (GV):**

- [ ] Modal chỉ mở cho booking có `subject === 'english'`. Booking Math không mở được.
- [ ] Thông tin học viên hiển thị chính xác: tên, năm sinh (từ Profile Catalog), grade, SĐT.
- [ ] Dropdown Evaluator hiển thị danh sách giáo viên, searchable.
- [ ] Dropdown Test Type hiển thị đúng 4 loại (Pre-Starters, Starters, Movers, Flyers). Mặc định Pre-Starters.
- [ ] Bảng chấm điểm: 8 cột x 3 hàng radio buttons hoạt động đúng (mỗi cột chỉ 1 giá trị).
- [ ] Tổng điểm Speaking tính realtime, đúng công thức (tổng 8 cột, max 8).
- [ ] Speaking Level tự động xếp hạng đúng theo bảng (Pending / Needs support / Developing / Confident / Advanced).
- [ ] Teacher Feedback: 7 tiêu chí, mỗi tiêu chí 2 radio options (positive/negative), chọn độc lập.
- [ ] Weaknesses: chọn được tối đa 3. Chọn đủ 3 → disable các option còn lại. Bỏ chọn → enable lại.
- [ ] Click "Update": lưu đúng payload, cập nhật `testResult.assessment` và `testResult.speaking` trên booking.
- [ ] Mở lại modal cho booking đã đánh giá: form restore đúng dữ liệu đã lưu (evaluator, scores, feedback, weaknesses).
- [ ] Tab "Old Form" hiển thị placeholder text, không có chức năng.
- [ ] Format điểm Speaking: bỏ `.0` (hiện `6/8` thay vì `6.0/8`).

**Phần C — Tổng hợp kết quả:**

- [ ] Bảng danh sách hiển thị đúng cả 2 cột Speaking (từ GV) và LWR (từ LMS) trên cùng 1 dòng booking.
- [ ] Khi chỉ có 1 trong 2 kết quả (Speaking hoặc LWR), cột còn lại hiển thị "—" mà không ảnh hưởng cột kia.
- [ ] Detail modal hiển thị đủ 4 thẻ kết quả (Level, Lộ trình, Speaking, LWR) với đúng nguồn dữ liệu.
