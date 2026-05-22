---
id: US-CLS02-01
title: "Quản lý danh sách Lớp học"
type: "User Story"
domain: "CAP-OPS"
bf: BF-CLS02
status: "Draft"
tags: [user-story, class-list]
---

# US-CLS02-01: Quản lý danh sách Lớp học

> **Tham chiếu:** BF-CLS-02 · `[POLICY-DS-03]` · Design System §4.2 List Page Pattern

## 1. User Story

**Là một** Giáo vụ / Quản lý chi nhánh / Giáo viên,
**tôi muốn** xem danh sách tất cả Lớp học từ Nháp trở đi, lọc theo trạng thái và chi nhánh,
**để** theo dõi, quản lý và thao tác nhanh trên các lớp được giao phụ trách.

---

## 2. Thông tin cơ bản

| Thuộc tính | Giá trị |
|------------|---------|
| **BF:** | BF-CLS-02 (Quản lý Lớp học) |
| **CAP:** | CAP-OPS |
| **Màn hình:** | `/app/classes` |
| **Nhóm menu:** | Quản lý lớp học |
| **Vai trò:** | Quản trị viên, Quản lý chi nhánh, Giáo vụ, Giáo viên |
| **Ưu tiên:** | Cao (P0) |

---

## 3. Điều kiện tiền quyết

1. Lớp học đã được tạo tối thiểu ở trạng thái "Nháp".
2. Giáo viên chỉ thấy lớp mình được phân công. Quản lý/Giáo vụ thấy tất cả (hoặc theo chi nhánh nếu phân quyền).

---

## 4. Mô tả chi tiết

### 4.1. Bố cục tổng thể

```
┌──────────────────────────────────────────────────────────────────────┐
│ [Tab trạng thái: Tất cả | Nháp | Mở chiêu sinh | Đang học | ...]   │
├──────────────────────────────┬──────────────────┬────────────────────┤
│ [Chi nhánh ▼]               │ [Tìm kiếm...]    │ [Bộ lọc] [Tạo lớp] │
├──────────────────────────────┴──────────────────┴────────────────────┤
│                                                                      │
│  BẢNG DANH SÁCH LỚP HỌC (Data Table)                                │
│                                                                      │
├──────────────────────────────────────────────────────────────────────┤
│ [Hiển thị X/X]  [Số dòng: 20 ▼]  [⟨ 1 2 3 ⟩]                        │
└──────────────────────────────────────────────────────────────────────┘
```

### 4.2. Tab trạng thái (Segmented Control)

Hiển thị trên cùng, ngay dưới tiêu đề trang:

| Tab | Tên | Mô tả | Đếm |
|-----|-----|-------|-----|
| Tất cả | Tất cả | Tổng số lớp mọi trạng thái | Tổng |
| Nháp | Nháp | Lớp mới tạo, chưa cấu hình đủ | Đếm |
| Mở chiêu sinh | Mở chiêu sinh | Đã đủ cấu hình, chờ học viên | Đếm |
| Đang học | Đang học | Lớp đang vận hành | Đếm |
| Đóng lớp | Đóng lớp | Đã kết thúc khóa | Đếm |
| Hủy | Hủy | Không đủ học viên | Đếm |

Mặc định: "Tất cả".

### 4.3. Thanh công cụ (Toolbar) — cùng hàng ngang

| Thành phần | Vị trí | Mô tả |
|-----------|--------|-------|
| BranchSelect | Bên trái hàng toolbar | Lọc theo chi nhánh. Mặc định "Tất cả". |
| SearchInput | Giữa hàng toolbar | Tìm theo: tên lớp, mã lớp, giáo viên, phòng học |
| FilterIconButton | Bên phải | Mở FilterSheet |
| Button "Tạo lớp" | Bên phải (nút chính) | Mở Dialog tạo lớp mới |

### 4.4. Bảng cột thông tin

| Cột | Loại | Mô tả |
|-----|------|-------|
| Mã lớp | Văn bản | Mã duy nhất (VD: "CLS-IELTS-001"). Font mono, màu phụ |
| Tên lớp | Văn bản + Link | In đậm, click → Chi tiết lớp `/app/classes/[id]` |
| Chi nhánh | Văn bản | Tên chi nhánh |
| Giáo viên | Văn bản | Tên GV chủ nhiệm |
| Sĩ số | Số / Số | VD: "12/20" + thanh tiến trình nhỏ (cảnh báo nếu ≥80%) |
| Lịch học | Văn bản | Tóm tắt: "T2/4/6 18:00–19:30" |
| Phòng | Văn bản | Tên phòng học |
| Trạng thái | Badge | Nhãn màu theo quy tắc `statusColors.ts` |
| Ngày bắt đầu | Date | DD/MM/YYYY |
| Ngày kết thúc | Date | DD/MM/YYYY (nếu có) |
| Hành động | Nút | Menu: Xem chi tiết / Chỉnh sửa / Mở lớp / Đóng lớp (tùy trạng thái) |

### 4.5. Bộ lọc nâng cao (FilterSheet)

| Nhóm lọc | Loại | Tùy chọn |
|----------|------|----------|
| Chi nhánh | Multi-select | Hiển thị + số đếm mỗi chi nhánh |
| Giáo viên | Multi-select | Danh sách GV đang phụ trách |
| Trình độ | Multi-select | IELTS, TOEIC, Beginner, Movers... |
| Phòng học | Multi-select | Danh sách phòng |
| Khoảng ngày | Date range | Từ ngày → Đến ngày (theo ngày bắt đầu) |

### 4.6. Hành động theo trạng thái

| Trạng thái | Action khả dụng |
|-----------|----------------|
| Nháp | Chỉnh sửa, Xóa (xác nhận), Mở lớp |
| Mở chiêu sinh | Chỉnh sửa, Hủy (xác nhận), Xem chi tiết |
| Đang học | Xem chi tiết, Đóng lớp (xác nhận) |
| Đóng lớp | Xem chi tiết (read-only) |
| Hủy | Xem chi tiết (read-only) |

### 4.7. Phân quyền xem

| Vai trò | Dữ liệu thấy |
|---------|-------------|
| Quản trị viên | Tất cả lớp, mọi chi nhánh |
| Quản lý chi nhánh | Tất cả lớp thuộc chi nhánh mình |
| Giáo vụ | Tất cả lớp (toàn hệ thống) |
| Giáo viên | Chỉ lớp mình được phân công |

---

## 5. Trường hợp đặc biệt

| # | Trường hợp | Hành vi |
|---|-----------|---------|
| 5.1 | Không có lớp nào | EmptyState: "Chưa có lớp học nào" + nút "Tạo lớp mới" |
| 5.2 | Đang tải dữ liệu | `<ModuleLoadingSkeleton />` với 10 dòng |
| 5.3 | Lỗi tải dữ liệu | `<ErrorState />` với nút "Thử lại" |
| 5.4 | Giáo viên không có lớp nào | EmptyState: "Bạn chưa được phân công lớp nào" |
| 5.5 | Xóa lớp Nháp | ConfirmDialog: "Bạn có chắc muốn xóa lớp này?" |
| 5.6 | Mở lớp chưa đủ Syllabus | Cảnh báo: "Lớp chưa được gắn Khung chương trình" |

---

## 6. Tiêu chí chấp nhận

- [ ] Tab trạng thái hiển thị 6 tab với số đếm chính xác
- [ ] BranchSelect nằm cùng hàng toolbar với Search và Filter
- [ ] Tìm kiếm hoạt động trên 4 trường: tên lớp, mã lớp, giáo viên, phòng
- [ ] Bảng hiển thị đủ 11 cột như mục 4.4
- [ ] Click tên lớp → chuyển đến `/app/classes/[id]`
- [ ] Badge trạng thái dùng `getStatusBadgeClass` từ `statusColors.ts`
- [ ] Action menu hiển thị đúng action theo trạng thái lớp
- [ ] Phân quyền: giáo viên chỉ thấy lớp của mình
- [ ] EmptyState / Loading / Error hiển thị đúng
- [ ] Phân trang mặc định 20 dòng/page, options [20, 50, 100]

---

## 7. Nghiệp vụ liên quan

| Hướng | BF | Tương tác |
|-------|-----|-----------|
| **Đầu ra** | BF-OPS-02 | Lấy danh sách lớp để xếp lịch |
| **Đầu ra** | BF-CLS-04 | Phân công GV chủ nhiệm |
| **Đầu ra** | BF-CLS-03 | Xem Roster học viên trong lớp |

---

## Chỉ dẫn cho AI Agent & Lập trình viên

- Dùng `<SegmentedControl />` cho tab trạng thái
- Dùng `<BranchSelect />` từ `@/components/controls` cho lọc chi nhánh (cùng hàng toolbar)
- Dùng `<DataTableFrame />` từ `@/components/data-table` cho bảng
- Dùng `<FilterSheetPanel />` từ `@/components/filters` cho bộ lọc nâng cao
- Dùng `<ConfirmDialog />` cho xóa/hủy/mở/đóng lớp
- Mock data: lấy từ `src/mocks/classes.ts`
- Status badges: ánh xạ vào `ENTITY_STATUS_MAP` trong `statusColors.ts`
