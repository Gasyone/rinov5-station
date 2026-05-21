# Tổng quan Hệ Sinh thái RinoEdu (Ecosystem Overview)

> Cập nhật lần cuối: 2026-05-17

## 1. Giới thiệu RinoEdu

RinoEdu là một tổ chức kinh doanh giáo dục chuyên cung cấp các chương trình học nâng cao, bao gồm các bộ môn như Toán, Tiếng Anh và nhiều môn học khác.

## 2. Mô hình Hoạt động (3 Delivery Channels)

Hệ sinh thái giáo dục của RinoEdu vận hành song song 3 mô hình giảng dạy (Delivery Channel):

| Channel | Mô tả | Hình thức | Quy mô lớp |
|---------|-------|-----------|-------------|
| **Station** | Trung tâm học tập vật lý (Offline) | Học viên đến học trực tiếp tại cơ sở, chi nhánh | 8-15 học viên |
| **Tutor** | Gia sư online | Giáo viên kèm riêng 1-1 hoặc nhóm nhỏ qua nền tảng số | 1-3 học viên |
| **Digital** | Giáo viên kỹ thuật số (Online) | Lớp học trực tuyến quy mô lớn hơn | 10-30+ học viên |

## 3. Hệ thống Domain hiện hữu

RinoEdu hiện có nhiều domain phần mềm riêng biệt đang vận hành song song:

```
┌─────────────────────────────────────────────────────────┐
│                    HỆ SINH THÁI RINOEDU                 │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │   LMS    │  │   CRM    │  │ ERP (cũ) │  │  CARE  │  │
│  │ Learning │  │ Customer │  │ Quản trị │  │ Chăm   │  │
│  │ Mgmt Sys │  │ Relation │  │ Tổng hợp │  │ sóc KH │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └───┬────┘  │
│       │             │             │             │       │
│       └─────────────┴──────┬──────┴─────────────┘       │
│                            │                            │
│                    PHÂN MẢNH DỮ LIỆU                   │
│              Profile trùng, Data không đồng bộ          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐    │
│  │              RINOV5 (Station ERP)               │    │
│  │    All-in-One ERP chuyên biệt cho Station       │    │
│  │    Hợp nhất CRM + ERP + CARE + Scheduling       │    │
│  │    vào 1 nền tảng duy nhất                      │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

| Domain hiện có | Chức năng | Tình trạng | Rinov5 thay thế? |
|---------------|-----------|------------|------------------|
| **LMS** | Quản lý nội dung học, bài tập online, test online | Đang vận hành | ❌ Không — LMS tiếp tục hoạt động, Rinov5 tích hợp |
| **CRM (cũ)** | Quản lý Lead, Pipeline bán hàng | Đang vận hành | ✅ Rinov5 thay thế cho Station (CAP-ADM, CAP-COM) |
| **ERP (cũ)** | Quản lý lớp, nhân sự, tài chính | Đang vận hành | ✅ Rinov5 thay thế cho Station (CAP-OPS, CAP-HR, CAP-FIN) |
| **CARE (cũ)** | Chăm sóc khách hàng, Ticket | Đang vận hành | ✅ Rinov5 thay thế cho Station (CAP-CARE) |

## 4. Định vị Rinov5 — Station ERP All-in-One

**Dự án Rinov5** (kế thừa từ Rinov4) là phân hệ **All-in-One ERP chuyên biệt cho mô hình Station**, hợp nhất các domain phân mảnh (CRM, ERP cũ, CARE) vào 1 nền tảng duy nhất.

**Rinov5 bao gồm 11 Business Capabilities (CAP)** — xem chi tiết tại [CAP-MAP.md](./business-functions/CAP-MAP.md) và [CATALOG.md](./business-functions/CATALOG.md).

### Rinov5 làm gì và KHÔNG làm gì

| ✅ Rinov5 làm | ❌ Rinov5 KHÔNG làm |
|--------------|-------------------|
| Quản lý tuyển sinh Station (Lead, Test, Học thử) | Vận hành Tutor / Digital (khác domain) |
| Quản lý lớp học offline (Lịch, Điểm danh, GV) | LMS online learning content |
| Quản lý đơn hàng, sản phẩm, thanh toán | Payroll / Kế toán chi tiết |
| Quản lý nhân sự, chi nhánh, tổ chức | AI/ML recommendation engine |
| Chăm sóc học viên, Ticket, Tái phí | Mobile app cho học viên/phụ huynh |
| Phân quyền IAM, Cấu hình hệ thống | |
| Báo cáo, Dashboard, KPI | |

## 5. Dữ liệu dùng chung xuyên Channel (Cross-Domain Sharing)

Một số dữ liệu được thiết kế để dùng chung giữa Station, Tutor, Digital:

| Dữ liệu | CAP sở hữu | Dùng chung? | Ghi chú |
|----------|-----------|-------------|---------|
| **Person Profile (PII)** | CAP-MDM | ✅ 100% chung | 1 người = 1 Golden Record, bất kể học ở đâu |
| **Family Profile** | CAP-MDM | ✅ 100% chung | Quan hệ gia đình không phụ thuộc channel |
| **User Account & IAM** | CAP-SYS | ✅ 100% chung | Phân quyền, Login chung toàn hệ sinh thái |
| **Curriculum & Syllabus** | CAP-ACD | ✅ ~90% chung | Nội dung giảng dạy dùng chung, khác format delivery |
| **Product Catalog** | CAP-COM | 🔶 ~80% chung | Cùng engine, khác pricing model |
| **Class & Session** | CAP-OPS | 🔶 ~40% chung | Core concept chung, execution khác (offline vs online) |
| **Employee** | CAP-HR | 🔶 ~50% chung | Station: NV cơ hữu. Tutor: Freelance. Digital: GV số |
| **Facility** | CAP-FCM | ❌ Chỉ Station | Digital/Tutor không cần CSVC |

## 6. Lưu ý Kiến trúc (Parallel Domains)

Vì RinoEdu có các domain Tutor và Digital chạy song song với Station:

1. **Channel Dimension:** Các thực thể cần phân biệt channel sẽ mang trường `channel: station | digital | tutor`. Không hardcode logic chỉ cho Station.
2. **Cross-domain Profile:** MDM Profile (`profile_id`) là mã định danh chung. Khi học viên Station chuyển sang Tutor, profile không đổi — chỉ tạo enrollment mới.
3. **API-ready:** Rinov5 thiết kế API sẵn sàng để Tutor/Digital domain gọi lấy dữ liệu chung (Profile, Product, Curriculum).
4. **Tránh phụ thuộc:** Tutor/Digital KHÔNG phụ thuộc vào Rinov5 để vận hành. Rinov5 là domain Station, các domain khác có hệ thống riêng.
