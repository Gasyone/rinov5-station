---
title: "BF-RPT-01: Hệ thống Báo cáo (Reporting & Analytics)"
type: "Business Function"
domain: "CAP-RPT"
status: "Draft"
tags: [report, analytics, dashboard]
---

# BF-RPT-01: Hệ thống Báo cáo (Reporting & Analytics)

> **Capability:** CAP-RPT (Năng lực Báo cáo & Phân tích)
> **Giai đoạn:** 4 - Vận hành hàng ngày
> **Nhóm chức năng:** Báo cáo
> **Mã màn hình:** `branch_report`, `chain_report`, `regional_report`, `advanced_report`, `sales_report`

---

## 1. Mô tả tổng quan

Phân hệ tập trung tổng hợp, xử lý và trực quan hóa dữ liệu (Data Visualization) từ tất cả các phân hệ nghiệp vụ khác (Sales, Ops, Academic, HR) để tạo ra các bảng điều khiển (Dashboards) và Báo cáo (Reports). Phân hệ này cung cấp góc nhìn đa chiều, hỗ trợ Ban Giám đốc và Quản lý cấp trung ra quyết định dựa trên dữ liệu thực tế (Data-driven decision making).

## 2. Đối tượng sử dụng (Vai trò)

- **Ban Giám đốc (C-Level / VPs):** Xem báo cáo Chuỗi (Chain), Báo cáo Tài chính toàn hệ thống.
- **Giám đốc Vùng (Regional Manager):** Xem báo cáo tổng hợp của các chi nhánh thuộc vùng mình quản lý.
- **Giám đốc Chi nhánh (Branch Manager):** Xem báo cáo vận hành, doanh thu, học thuật nội bộ tại cơ sở mình.

## 3. Ranh giới Nghiệp vụ (Scope)

### Có bao gồm (In Scope)
- Cung cấp các Bảng điều khiển (Dashboard) trực quan về Doanh thu, Tỷ lệ tuyển sinh mới (Enrollment Rate), Tỷ lệ duy trì (Retention Rate).
- Cho phép Lọc (Filter) báo cáo đa chiều theo: Thời gian, Chi nhánh, Vùng, Sản phẩm/Khóa học.
- Xuất dữ liệu báo cáo ra định dạng Excel/CSV.
- Phân quyền xem báo cáo chặt chẽ theo Data Scope của tài khoản (Ví dụ: BM chỉ xem được số liệu của chi nhánh mình).

### Không bao gồm (Out of Scope)
- Chỉnh sửa, xóa dữ liệu trực tiếp trên màn hình Báo cáo → Chỉ hiển thị Read-only.
- Báo cáo thuế kế toán chuẩn nhà nước (VAT, Thu nhập doanh nghiệp) → Thuộc hệ thống Kế toán nội bộ (ERP Finance).

## 4. Mô hình Dữ liệu Nghiệp vụ (Data Entities)

| Tên Thực thể | Trường định danh | Thuộc tính quan trọng | Ràng buộc quan hệ | Diễn giải |
|--------------|------------------|-----------------------|-------------------|----------|
| Mẫu Báo cáo (Report Template) | Mã Báo cáo | Tên, Loại (Biểu đồ/Bảng), Phân quyền xem | Độc lập | Khuôn dạng hiển thị. |
| Bộ Dữ liệu (Dataset View) | Tên View | Câu truy vấn SQL, Các tham số lọc (Date, Branch) | Độc lập | Nguồn cấp dữ liệu đã tổng hợp. |

### 4.1. Vòng đời Trạng thái (Status Lifecycle)

*(Phân hệ này chủ yếu mang tính Read-only (Đọc dữ liệu), do đó không có vòng đời trạng thái phức tạp của thực thể. Dữ liệu báo cáo là dữ liệu Real-time hoặc Batch được tổng hợp từ các kho dữ liệu khác).*

### 4.2. Ví dụ Dữ liệu mẫu

*Giúp AI và Lập trình viên thiết kế giao diện biểu đồ.*

| Loại Báo cáo | Bộ Lọc (Filters) | Dữ liệu hiển thị (Kết quả) |
|--------------|------------------|---------------------------|
| Báo cáo Tuyển sinh | Tháng 10/2026, Khu vực: Hà Nội | Biểu đồ cột: Cơ sở A (150 học viên mới), Cơ sở B (120 học viên mới). |
| Báo cáo Tài chính | Quý 3/2026, Toàn Chuỗi | Bảng số liệu: Tổng doanh thu (10 Tỷ), Tiền hoàn (200 Triệu), Doanh thu thuần. |

## 5. Quy tắc Nghiệp vụ Tổng thể (Business Rules)

1. **[RULE-RPT-01-01] Áp dụng chặt chẽ Data Scope:** Mọi câu truy vấn dữ liệu (Query) khi gọi Báo cáo đều BẮT BUỘC phải đính kèm bộ lọc (Filter) ngầm dựa theo quyền (Entitlement) và vùng dữ liệu (Data Scope) sinh ra từ `BF-SYS-04`. Không có ngoại lệ.
2. **[RULE-RPT-01-02] Cache Dữ liệu lớn:** Đối với các Báo cáo tổng hợp Chuỗi có khối lượng tính toán lớn, dữ liệu có thể không cần Real-time (Thời gian thực) 100%, mà được phép hiển thị dữ liệu Cache (Lưu tạm) của ngày hôm trước (T+1) để tránh làm sập hệ thống cơ sở dữ liệu vận hành.

## 6. Danh sách Yêu cầu Người dùng (User Stories)

| Mã Yêu cầu | Tên Yêu cầu (Loại màn hình) | Đường dẫn truy cập | Trạng thái |
|------------|-----------------------------|--------------------|------------|
| US-RPT-01-01 | Dashboard Báo cáo Doanh thu & Bán hàng | /app/sales_report | Đang soạn thảo |
| US-RPT-01-02 | Dashboard Báo cáo Vận hành & Học thuật (Điểm danh, Retention) | /app/branch_report | Đang soạn thảo |
| US-RPT-01-03 | Tính năng Xuất dữ liệu (Export to Excel) | Trong màn hình Báo cáo | Đang soạn thảo |

---

## 7. Chỉ dẫn cho AI Agent & Lập trình viên (Business Architecture)

- Tuân thủ chặt chẽ cấu trúc thực thể ở mục 4. Phải đảm bảo tính toàn vẹn dữ liệu nghiệp vụ (dữ liệu bảng con phải trỏ đúng mã có thật của bảng cha).
- Mọi trạng thái liệt kê trong sơ đồ 4.1 phải được ánh xạ đầy đủ vào hệ thống.
- Giao diện và luồng xử lý phải tuân thủ bảng chuyển đổi trạng thái (chỉ hiển thị các hành động hợp lệ theo từng trạng thái và phân quyền).

### ⛔ Hàng rào An toàn (Guardrails)
- **KHÔNG** thêm trường dữ liệu hoặc thực thể ngoài danh sách quy định ở mục 4.
- **KHÔNG** thay đổi cấu trúc quan hệ thực thể mà chưa được phê duyệt từ Product Owner.
- **KHÔNG** tạo trạng thái nghiệp vụ mới ngoài sơ đồ ở mục 4.1. Mọi sự thay đổi vòng đời phải được cập nhật vào tài liệu này trước.

