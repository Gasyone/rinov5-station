# Cẩm nang Kỹ năng Viết & Biên tập Tài liệu Nghiệp vụ (5-Tier BA Suite)

Tài liệu này quy định quy trình, nguyên tắc và hướng dẫn kỹ năng dành cho AI Agent khi tiến hành biên soạn, cập nhật các tài liệu nghiệp vụ (thuộc mô hình 5-Tier: Vision, BR, SR, Persona, CAP, BF, US, FLOW) của dự án Rinov5 EdTech ERP.

---

## 1. Nguyên tắc cốt lõi (Core First Principles)

### 1.1. Trung thực Dữ liệu & Không suy diễn Kỹ thuật / Số liệu
- **Không tự ý suy diễn bối cảnh doanh nghiệp:** Bối cảnh và vấn đề thực tế để dạng thẻ giữ chỗ `[Người dùng tự điền...]` để chủ doanh nghiệp / PO tự bổ sung.
- **Không bịa đặt số liệu hiện trạng (Baseline) và API máy chủ:** Bảng KPI chỉ đề xuất mục tiêu tương lai (Target) và phương pháp đo lường. Không vẽ ra các API endpoint / JSON payload giả định nếu không có tài liệu kỹ thuật Backend chính thức.
- **Bảo toàn dữ liệu gốc từ DOM:** Toàn bộ chuỗi ký tự, nhãn, mẫu che bảo mật (như `xxxxxx122`) phải trích xuất nguyên văn từ giao diện thực tế.

### 1.2. Phân tách Thuộc tính Thực thể & Trạng thái Phễu Vòng đời
- Các giá trị trong bộ lọc tìm kiếm (như `student_status`: `Đang học`, `Bảo lưu`) là **Thuộc tính thực thể**, không được đưa vào làm các bước chuyển đổi trong sơ đồ trạng thái phễu.
- Trạng thái kết thúc (Completed / Lost / Canceled) là **Trạng thái Kết thúc Toàn cục (Global Terminal State)**, có thể chuyển trực tiếp từ bất kỳ giai đoạn nào kèm lý do.

### 1.3. Phân quyền Động theo Năng lực Nguyên tử (Atomic Capabilities)
- **Khai báo tại BF:** Khai báo toàn bộ danh mục quyền hạn dưới dạng **Mã Quyền Hạn Nguyên Tử** (ví dụ: `<domain>.<entity>.<action>`) tại BF.
- **Không gán cứng Role:** Tuyệt đối không tạo ma trận gán quyền tĩnh cho các Role (Admin, CSM, Teacher...) vì quyền hạn được người dùng tự gán động trong phân hệ Quản trị.
- **Capability Gating tại US:** Các tài liệu User Story (US) chỉ kiểm soát hiển thị các nút/vùng giao diện theo mã quyền tương ứng.
- **Bảng User Stories tinh gọn:** Bảng danh sách User Stories con chỉ bao gồm: *Tên Yêu cầu (Màn hình / Hộp thoại), Phân loại, Mã Quyền Yêu Cầu*. Không đưa các cột mã tĩnh hoặc trạng thái tĩnh (Đã duyệt / Đang soạn thảo).

### 1.4. Quy tắc Nghiệp vụ Bám sát Giao diện Thực tế
- Quy tắc nghiệp vụ tổng thể phải được trích xuất trực tiếp từ các thành phần, bộ lọc, logic kết hợp và tương tác thực tế của trang (Page-grounded rules), không chèn các điều khoản trừu tượng hoặc mã quy tắc mẫu chung chung.

### 1.5. Ngôn ngữ Tự nhiên & Trực quan (`[POLICY-DS-05]`)
- **100% Không biệt ngữ kỹ thuật:** Tuyệt đối không đưa các thuật ngữ kỹ thuật, CSS hoặc tên biến vào nội dung nghiệp vụ chính. 
- **Bảng đối chiếu thuật ngữ bắt buộc:**
  | Thuật ngữ Kỹ thuật (Tránh dùng) | Thuật ngữ Nghiệp vụ (Bắt buộc dùng) |
  |:---|:---|
  | API, Backend, Endpoint, Server | Máy chủ, Hệ thống, Phản hồi từ máy chủ |
  | Frontend, Client, UI, DOM | Giao diện, Màn hình hiển thị |
  | Modal, Dialog, Popup | Hộp thoại nổi, Bảng thông tin nổi, Popup |
  | Dropdown, Select, Combobox | Ô chọn danh sách thả xuống, Danh sách lựa chọn |
  | Input, Textbox, Field | Ô nhập liệu, Trường nhập thông tin |
  | Checkbox, Radio button | Ô chọn, Hộp kiểm, Nút chọn duy nhất |
  | Toggle, Switch | Công tắc chuyển đổi trạng thái |
  | Hover (mouse hover) | Rê chuột, Con trỏ chuột di vào |
  | Active/Inactive, Enable/Disable | Kích hoạt / Tạm khóa, Cho phép / Vô hiệu hóa |
  | Loading skeleton, Spinner | Hiệu ứng tải dữ liệu, Màn hình chờ |
  | CSS, padding, border-radius, shadow | Bố cục co giãn, Bo góc nhẹ, Có bóng mờ |

---

## 2. Quy trình làm việc 4 pha bóc tách từ HTML to Doc

```mermaid
graph TD
    A[Pha 1: Quét DOM thực tế bằng Chrome Extension / MCP] --> B[Pha 2: Trích xuất Dữ liệu Gốc & Đối soát]
    B --> C[Pha 3: Mô hình hóa Trạng thái Phễu & Danh mục Quyền Động]
    C --> D[Pha 4: Sinh trọn bộ 5-Tier Markdown Lưu vào docs/]
```

1. **Pha 1: Bóc tách DOM qua Extension / MCP:** Thu thập chính xác toàn bộ form, bảng, bộ lọc và các nút hành động.
2. **Pha 2: Phân tích Dữ liệu Gốc:** Bóc tách chính xác các trường, nhãn, mặt nạ hiển thị mà không tự ý chuẩn hóa sai lệch.
3. **Pha 3: Mô hình hóa Nghiệp vụ:** Xây dựng sơ đồ State Diagram phi tuyến tính với Global Terminal States và bảng danh mục Atomic Capabilities tại BF.
4. **Pha 4: Xuất bản Tệp Markdown:** Sinh trọn bộ tài liệu (`BF`, `US List`, `US Form`, `US Detail`) lưu trực tiếp vào thư mục `docs/business-functions/<domain>/`.

---

## 3. Quy chuẩn Mẫu Đặc tả Nâng cấp & Điều chỉnh Nghiệp vụ (Upgrade & Adjustment US)

> **Căn cứ tham chiếu:** Chuẩn hóa theo mẫu tài liệu Confluence chính thức tại: [https://rinoeduai.atlassian.net/wiki/x/M4A_Cg](https://rinoeduai.atlassian.net/wiki/x/M4A_Cg) (Màn hình Nâng cấp Giao diện Lịch học Trung tâm).  
> **Tệp mẫu vàng (Golden Template):** `docs/templates/TEMPLATE-US-UPGRADE.md`

### 3.1. Khi nào áp dụng mẫu Nâng cấp / Điều chỉnh?
* Áp dụng khi cần:
  - Nâng cấp, tinh giản hoặc cải tiến bố cục màn hình hiện có theo thiết kế Figma mới.
  - Đồng bộ giao diện theo thực tế vận hành tại trung tâm (loại bỏ trường thừa, khôi phục hoặc bổ sung tính năng thiếu).
  - Điều chỉnh cơ chế lọc, thẻ hiển thị, phân nhóm ca làm việc hoặc bảng nổi (hover popup).

### 3.2. Cấu trúc 4 phần chuẩn hóa của tài liệu Nâng cấp

Tài liệu User Story Nâng cấp/Điều chỉnh được tinh giản tối đa thành **4 phần chính mạch lạc**:

#### Phần 1: NHẬT KÝ THAY ĐỔI & BỐI CẢNH (CHANGELOG & CONTEXT)
* **Bảng lịch sử cập nhật (Changelog):** Gồm 3 cột `Ngày cập nhật | Nội dung cập nhật | Lý do cập nhật`.
* **Ràng buộc nghiệp vụ toàn cục (Global Rules):** Nêu rõ các nguyên tắc cốt lõi:
  - `[RULE-XXX-01] Bảo toàn dữ liệu & Không thay đổi xử lý hệ thống:` Chỉ điều chỉnh hiển thị/tương tác, không thay đổi logic xử lý hệ thống cũ.
  - `[RULE-XXX-02] Che số điện thoại bảo mật chống sao chép hàng loạt:` Luôn che số ở giữa dạng `091****111`.
  - `[RULE-XXX-03] Số đếm đi theo toàn bộ bộ lọc:` Số lượng trên thẻ trạng thái/tiêu đề tự động cập nhật theo tổ hợp bộ lọc.
  - `[RULE-XXX-04] Cơ chế lọc nháp đa tầng trên Bảng điều khiển:` Người dùng chọn nháp và chỉ kích hoạt khi bấm "Áp dụng".

#### Phần 2: MÔ TẢ GIAO DIỆN (UI DESCRIPTION & ADJUSTMENT MATRIX)
* Đính kèm đường dẫn Figma: `Giao diện: [https://www.figma.com/design/...](https://www.figma.com/design/...)`.
* Phân rã theo từng cụm thành phần giao diện (Tiểu mục `2.1`, `2.2`, `2.3`, `2.4`...).
* **Bảng 5 cột chuẩn bắt buộc:**
  `| Thành phần giao diện | Loại hiển thị | Dữ liệu & Quy tắc | Diễn giải quy tắc | Nội dung điều chỉnh |`
* **Quy tắc phân loại cột "Nội dung điều chỉnh":**
  - **Bổ sung / Thêm mới:** Thêm nút, ô chọn nhanh, nhóm lọc mới hoặc bảng nổi xem nhanh.
  - **Điều chỉnh:** Di dời vị trí, thay đổi kích thước, gộp dòng, đổi màu nhận diện, giới hạn độ dài kèm dấu `...`.
  - **Lược bỏ:** Gỡ bỏ các trường, nút hoặc icon thừa không còn dùng trong thực tế. **Bắt buộc bôi chữ đỏ nổi bật:** `<span style="color: rgb(255,86,48);">Lược bỏ...</span>` ở cả Cột 1 và Cột 5.

#### Phần 3: KHỐI CHỨC NĂNG CHI TIẾT: ACTION & LUỒNG KÍCH HOẠT (ACTIONS & EVENTS)
* Phân nhóm theo các Khối chức năng tương tác (Khối chức năng 1, Khối chức năng 2...).
* Mỗi hành động (Action X.Y) bắt buộc có:
  - **Luồng kích hoạt:** Hành vi người dùng thực hiện (nhấp, chọn, rê chuột 200 phần nghìn giây, gõ từ khóa...).
  - **Tiêu chí nghiệm thu (Acceptance Criteria):** Đầy đủ các trường hợp Happy Path, Alternate Path, Reset Path theo cấu trúc logic:
    - **Giả sử:** [Trạng thái và điều kiện tiên quyết của người dùng / hệ thống]
    - **Khi:** [Hành vi cụ thể của người dùng]
    - **Thì:** [Kết quả phản hồi của giao diện và hệ thống]

#### Phần 4: CÁC TRƯỜNG HỢP GÓC CẠNH & LUỒNG NGOẠI LỆ (CORNER CASES & EXCEPTION FLOWS)
* **Phân nhóm theo cụm chức năng:** Không để danh sách phẳng mà phân theo từng cụm (`Nhóm 1: Khung hiển thị & Điều hướng`, `Nhóm 2: Thẻ hiển thị & Nội dung đặc biệt`, `Nhóm 3: Bộ lọc nâng cao & Tìm kiếm`...).
* Tối thiểu $\ge 5$ trường hợp cụ thể (`[CASE-01]`, `[CASE-02]`,...).
* Cấu trúc từng trường hợp:
  - **Tình huống:** Mô tả hoàn cảnh phát sinh cụ thể (dữ liệu rỗng, tên quá dài, mất mạng, chưa phân công nhân sự, lớp có người dạy thay...).
  - **Xử lý:** Quy định cách giao diện và hệ thống hiển thị và phản hồi thân thiện.
