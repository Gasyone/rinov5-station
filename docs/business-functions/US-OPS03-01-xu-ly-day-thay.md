---
id: US-OPS03-01
title: "User Story"
type: "User Story"
domain: "CAP-OPS"
bf: BF-OPS-03
status: "Draft"
tags: [user-story]
---

# US-OPS03-01-xu-ly-day-thay

> Tài liệu đang chờ biên tập

## Đề xuất Giao diện (Expected UI/UX)
- **Màn hình:** Lịch tổng thể hoặc Tab Lịch học của Lớp.
- **Đề xuất UI:** Click vào 1 Buổi học (Event) -> Mở Popover (Card nhỏ) -> Chọn 'Dạy thay' -> Mở Modal List giáo viên rảnh giờ đó để thay thế.



## Cập nhật Kiến trúc
- **Lưu ý Kiến trúc:** Khi gán giáo viên dạy thay, hệ thống sẽ ngầm gọi thuật toán US-OPS02-03 để check xem giáo viên đó có bị trùng lịch hay không.