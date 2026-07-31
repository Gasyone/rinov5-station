# Tasks

- [x] Create `ClassesSessionCommentWarningDialog.tsx`
- [x] Update `ClassesSessionDetailDialog.tsx` to integrate the warning dialog and comment verification logic
- [x] 1. Di chuyển nút hành động "Tạo đơn hàng" và "Tạo ticket" lên header và xóa nút "Zalo".
- [x] 2. Tích hợp tab "Yêu cầu hỗ trợ" vào danh sách tab chính bên trái.
- [x] Create walkthrough.md to summarize changes
- [x] 13. Chuyển danh sách báo cáo học tập hàng tháng định kỳ sang hiển thị theo chiều dọc (flex-col) để hỗ trợ tốt khi có nhiều báo cáo.
- [x] Khởi tạo 3 file Markdown cục bộ trong `docs/00-business/`
- [x] Viết US-OPS-03-04: Nhận xét buổi học (Tiếng Anh, Toán, Kiểm tra Toán)
- [x] Viết US-OPS-03-05: Chấm điểm Speaking Tiếng Anh
- [x] Viết US-OPS-03-06: Đánh giá cuối kỳ Tiếng Anh
- [x] Chạy linter `npm run lint:docs` và sửa toàn bộ lỗi để đưa về 0 lỗi
- [x] Chuyển đổi và tạo 3 trang trên Confluence dưới thư mục cha `123207837`
- [x] Xác minh kết quả và bàn giao walkthrough
- [x] 14. Loại bỏ giới hạn chiều cao max-h-[180px] và thanh cuộn cục bộ ở phần "Nhận xét năng lực chi tiết" để tận dụng khoảng trống chân trang và loại bỏ thanh cuộn lồng nhau.
- [x] 15. Tinh giản dòng thông tin trong Feed tương tác: Xóa mã CS và thẻ CS, đưa nhãn ghi âm (Audio Play) sang bên trái, và lược bỏ các nhãn kênh liên hệ thừa ở góc phải.nges
- [x] 22. Đảo ngược vị trí hiển thị trong tab Lịch sử học tập: Đưa danh sách "Các bài kiểm tra định kỳ" lên phía trên danh sách "Lịch sử buổi học".
- [x] 23. Thống nhất ghim thẻ chăm sóc vào một component Modal duy nhất (RecordCareDialog): Hỗ trợ đầy đủ danh mục thẻ chuẩn và thẻ tùy chỉnh khác (KHAC - Tự chọn mã/tên/SLA/tiêu chí/mô tả), hiển thị Tiêu chí kích hoạt trực quan, đồng bộ dùng chung cho cả nút ở Cột học viên và nút trong Feed tương tác.
- [x] Cải tiến bộ lọc vai trò tại chi tiết chăm sóc học viên (Timeline): bỏ nền, thêm underline highlight, tính tỷ lệ % chăm sóc và thêm các tab Trễ hạn, Định kỳ, Khẩn cấp.
- [x] Tái cấu trúc Panel bên trái tại Dialog và Trang chi tiết: loại bỏ Tabs, hiển thị trực tiếp Báo cáo học tập ở bên trái; di chuyển Lịch sử chăm sóc sang tab bên phải.
- [x] Tinh giản và loại bỏ bớt các đường kẻ (borders) ở header, phần chia cột trái/phải, và viền panel để giao diện phẳng và thoáng đạt.
- [x] Gộp thẻ "KT Gần nhất" & "Trước đó" thành một thẻ "Điểm kiểm tra" và bổ sung thẻ thống kê "Đánh giá chung" hiển thị rating & trích dẫn nhận xét.
- [x] Khắc phục lỗi tràn ngang (Horizontal overflow) ở panel bên phải bằng cách chuyển từ grid phần trăm tuyệt đối `[60%_40%]` sang tỷ lệ phân số linh hoạt `[3fr_2fr]`.
- [x] Giảm 50% khoảng cách (gap) và padding đệm ở giữa hai panel để bố cục khít và tối ưu không gian sử dụng hơn.
- [x] Tái cấu trúc Header: Di chuyển chọn gói chương trình lên góc phải, đưa các nút thao tác xuống dưới tiêu đề học viên và đổi thành dạng Icon.
- [x] Bổ sung thông tin CS và Giáo viên ngay dưới bộ chọn gói học tập, cập nhật động theo gói học được chọn.
- [x] Tích hợp ảnh đại diện (Avatar) cho CS và Giáo viên, hỗ trợ hover để hiển thị popover thông tin chi tiết (PersonnelHoverCard).
- [x] Tách riêng thông tin CS và GV ra thành 2 cột ngang song song, thiết lập min-height cố định tránh giật lag nhảy giao diện khi thay đổi số lượng GV.
- [x] Tách mã lớp học xuống dòng dưới tên lớp học, loại bỏ đường line phân cách header lớp học.
- [x] Thiết lập mã lớp học dạng HoverCard hiển thị Profile tóm tắt của lớp học, và nhấp Click để mở modal chi tiết lớp học (`ClassesDetailDialog`).







