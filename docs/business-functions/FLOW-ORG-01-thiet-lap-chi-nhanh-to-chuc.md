# FLOW-ORG-01: Luồng Thiết lập Cơ sở & Tổ chức

## 1. Bối cảnh Nghiệp vụ (Context)
Luồng quy trình này mô tả cách hệ thống khởi tạo một Chi nhánh vật lý mới, thiết lập cơ sở vật chất (Phòng học, Giờ hoạt động), và cách gắn chi nhánh vật lý đó vào hệ thống Sơ đồ Tổ chức (Org Tree) để đi vào vận hành chính thức. Quy trình này kết nối 2 phân hệ `BF-ORG-01` (Quản lý Chi nhánh) và `BF-ORG-02` (Sơ đồ tổ chức).

## 2. Đối tượng và Hệ thống tham gia
*   **Quản trị Hệ thống (System Admin)**: Người có quyền tạo mới Node trên Sơ đồ tổ chức.
*   **Quản lý Vận hành (Ops Manager)**: Người khai báo danh sách phòng học và thiết lập giờ mở cửa.
*   **Hệ thống CAP-HR (ORG Module)**: Quản lý cả Chi nhánh và Sơ đồ tổ chức.

## 3. Sơ đồ Trình tự

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quản trị Hệ thống
    actor Ops as Quản lý Vận hành
    participant ORG1 as BF-ORG-01 (Chi nhánh)
    participant ORG2 as BF-ORG-02 (Tổ chức)
    participant OPS as CAP-OPS (Xếp lịch)

    %% Giai đoạn 1: Khởi tạo vật lý
    Admin->>ORG1: Tạo mới Chi nhánh (Tên, Địa chỉ, Tọa độ)
    ORG1-->>Admin: Lưu thành công (Trạng thái: Setup)
    
    Ops->>ORG1: Khai báo danh sách Phòng học & Sức chứa (US-ORG-01-02)
    Ops->>ORG1: Thiết lập Giờ hoạt động (US-ORG-01-01)
    ORG1-->>Ops: Hoàn tất khai báo cơ sở vật chất

    %% Giai đoạn 2: Gắn kết vào Cây tổ chức
    Admin->>ORG2: Chọn Node "Vùng" trên Sơ đồ tổ chức (US-ORG-02-01)
    Admin->>ORG2: Map Chi nhánh vật lý vừa tạo vào Node Vùng này
    ORG2-->>Admin: Gắn kết thành công

    %% Giai đoạn 3: Đưa vào hoạt động
    Admin->>ORG1: Chuyển trạng thái Chi nhánh thành "Hoạt động"
    
    %% Giai đoạn 4: Vận hành sử dụng
    OPS->>ORG1: (Tự động) Lấy danh sách phòng học để xếp lịch
    OPS->>ORG1: (Tự động) Kiểm tra sức chứa & Giờ hoạt động
```

## 4. Diễn giải các bước
1.  **Bước 1-2**: Chi nhánh mới sinh ra ở trạng thái "Setup" (Chưa hoạt động). Lúc này khối Vận hành chưa thể nhìn thấy chi nhánh này để xếp lớp.
2.  **Bước 3-5**: Khai báo các rào cản vật lý. Phòng học giới hạn Sức chứa. Giờ hoạt động giới hạn Thời gian.
3.  **Bước 6-8**: Bước quan trọng nhất để hệ thống hiểu Chi nhánh này thuộc quyền quản lý của ai. Việc Map (Gắn kết) vào một Node trên sơ đồ tổ chức giúp hệ thống tự động phân quyền dữ liệu. (Ví dụ: Gắn vào Vùng miền Nam thì Giám đốc Vùng miền Nam sẽ thấy dữ liệu).
4.  **Bước 9**: Khi mọi thứ đã sẵn sàng, Admin "Mở cửa" chi nhánh trên phần mềm.
5.  **Bước 10-11**: Từ lúc này, các phân hệ khác (Xếp lớp, Điểm danh) bắt đầu tương tác với Chi nhánh để sử dụng phòng học.

## 5. Xử lý Rẽ nhánh / Ngoại lệ
*   **Tình huống Chuyển vùng quản lý**: Chi nhánh chuyển từ Vùng A sang Vùng B. Admin vào `BF-ORG-02`, Gỡ Chi nhánh khỏi Node Vùng A, và Gắn vào Node Vùng B. Các dữ liệu vật lý (Phòng học, Giờ hoạt động) ở `BF-ORG-01` vẫn giữ nguyên không thay đổi.

---

## 6. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Các bước chuyển tiếp trong sơ đồ trên thường đi kèm việc cập nhật trạng thái nghiệp vụ. Cần thiết kế logic chuyển đổi trạng thái ở tầng Service/Domain.
- Tại các bước hệ thống tự động kiểm tra, phải đảm bảo tuân thủ nghiêm ngặt các quy tắc Business Rules tương ứng từ tài liệu BF/US.

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** bỏ qua các bước Xác nhận / Phê duyệt (Approval/Confirmation) đã được quy định trong sơ đồ trình tự.
- **KHÔNG** thay đổi thứ tự hoặc tự ý bỏ bước trong luồng mà chưa được phê duyệt từ Product Owner.
- **KHÔNG** cho phép đổi trạng thái Chi nhánh thành "Hoạt động" nếu chưa khai báo ít nhất 1 Phòng học và 1 Khung giờ hoạt động.
