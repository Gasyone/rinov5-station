# Yêu cầu Người dùng & Hiện trạng (User Requirements & Status) - Đặt lịch thi đầu vào (Booking Test)

Tài liệu này ghi nhận các yêu cầu nghiệp vụ, mô tả nghiệp vụ và đánh giá hiện trạng triển khai của module **Đặt lịch thi đầu vào (Booking Test)** thuộc phân hệ Tuyển sinh.

---

## 1. Mô tả Nghiệp vụ (Business Description)

*Nhập mô tả tổng quan về luồng nghiệp vụ, mục tiêu của module này đối với vận hành của trung tâm.*
- **Mục tiêu chính:** Tài liệu này là tài liệu đầu vào cho việc phát triển tính năng cho module đặt booking trải nghiệm
- **Đối tượng sử dụng chính:** Học sinh là người được đăng ký, phụ huynh sẽ là phụ trách, sale là nhân viên tuyển sinh, cs là quản lý và xác nhận, quản lý giáo viên là người phân bổ nhân sự test, giáo viên là người phỏng vấn, đánh giá, ipad là nơi làm bài test
- **Phạm vi nghiệp vụ:**
booking trải nghiệm cho học viên từ crm
Quản lý danh sách trải nghiệm
Phân bổ nhân sự
Lấy dữ liệu bài test từ ipad
Giáo viên phỏng vấn và phát hành báo cáo nhận xét
Hệ thống đo lường và đề xuất trình độ
Sale nhận dữ liệu trình độ và kết quả test, phỏng vấn trên crm
Hệ thống crm và erp station là 2 domain khác nhau và sử dụng độc lập

## 2. Danh sách Yêu cầu Nghiệp vụ (Requirements List)

*Mô tả các tính năng, hành vi mong muốn của người dùng đối với module này.*
Hiện tại booking vẫn từ crm, dùng luồng booking cũ, chưa cập nhật gì ở đây
Kho booking trải nghiệm chọn con, chọn thời gian test, chọn trường, chọn chương trình, chọn level, và tạo test
Chỉ chọn thời gian bắt đầu, nhưng hệ thống thiết lập thời gian test mặc định là 30p để giáo viên phỏng vấn
Khi đã booking nó sẽ tạo 1 dữ liệu trong booking trải nghiệm và tạo 1 bài test trên ipad để học sinh khi đến có thể thực hiện test
Không thể booking trải nghiệm mới khi booking test chưa hoàn thiện
Nghiệp vụ cũ là khi đã booking test thì phải xác nhận ở erp, thì lúc đó mới làm được bài test, bây giờ đổi thành vẫn xác nhận để checkin học sinh đến, và bài thi vẫn được làm dù không có xác nhận.
Ngoài xác nhận để checkin, có thể tự động xác nhận học sinh đến khi làm bài test, phỏng vấn, nghĩa là đã chuyển sang trạng thái đang đánh giá, nó vẫn lọc cả được đã đến. 
quản lý giáo viên xem và tương tác để gán giáo viên, có thể lọc những booking chưa có giáo viên
quản lý giáo viên chọn gán giáo viên, hiện modal danh sách giáo viên và nhân sự khác, có tên giáo viên, avatar và chức danh.
Giáo viên có thể chọn để đổi giáo viên khác, khi mở modal đổi giáo viên, nó sẽ hiển thị thông tin giáo viên đang chọn, chọn giáo viên khác để đổi.
Quản lý giáo viên có thể quản lý nhiều trường, xem tất cả hoặc chọn bộ lọc từng trường để lọc và thao tác.
Giáo viên được gán sẽ nhận được booking ở lịch của mình phải phụ trách trong danh sách booking theo tài khoảng và các trường phụ trách
Khi thực hiện test, giáo viên mở detail có thể chọn hủy lịch test nếu như học viên không đến,
Khi thực hiện test, giáo viên có thẻ mở detail và chọn không đạt để ghi nhận trạng thái học viên
Khi thực hiện test, mở modal để ghi nhận đánh giá và feedback theo form có sẵn trong hệ thống để ghi nhận điểm phỏng vấn và nhận xét,
Sau khi nhận xét và chấm điểm xong, giáo viên ấn xác nhận để phát hành báo cáo phỏng vấn, hệ thống sẽ tính toán và trả kết quả và link kết quả riêng.
Học sinh làm xong trên ipad, điểm sẽ trả về booking,
Khi có đủ điểm ipad và phỏng vấn từ giáo viên, hệ thống sẽ đo lường và đề xuất level, sub level
Các booking có tiếng anh theo chương trình đã chọn trước đó
Modal có phần ghi chú để các thành viên ghi nhận ghi chú của booking này
Có tab lịch sử để ghi nhận mọi lịch sử tương tác của booking này.
design ở link figma: https://www.figma.com/design/frct7JUaJQBN2uOSyfMqcL/Rinoedu?node-id=154-81
Sau khi có đầy đủ tính toán từ phía hệ thống, giáo viên có thể án hoàn thành để hoàn tất booking
Hoặc có thể ấn trước để hoàn tất booking.
báo cáo đánh giá sẽ trả dữ liệu về CRM cho sale nắm thông tin
dữ liệu chỉ lọc theo giáo viên và trường họ được gán, booking họ được gán. 
Các trạng thái và trạng thái ảo mong muốn bao gồm tất cả, đã đặt lịch, chưa gán gv, đã check inm đang đánh giá, đã phỏng vấn, đã làm bài, hoàn tất, không đạt, đã hủy, các trạng thái tương đương với màu sắc giao diện
Booking đẩy từ crm sang là theo thời gian thực, bản thân modal booking đó là từ erp, bên crm kéo api sang để làm giao diện booking từ crm
CRM sẽ nhận được kết quả ngay lập tức để tư vấn
dữ liệu phải đẩy từ crm sang, nếu erp chưa có, nó sẽ tạo bên erp, lưu ý, hệ thống student id là 1.
Logic Ca trải nghiệm 30 phút, Không nên đổi, vì sẽ có rất nhiều lịch booking phía sau liên quan, giáo viên phải chủ động điều phối thời gian cho phù hợp, hoặc đổi giáo viên phụ trách khác,
Kế hoạch trải nghiệm của học sinh: Bài trải nghiệm iPad (Nghe-Đọc-Viết) và ca phỏng vấn (Speaking) không quan trọng, có thể trước sau, nhưng phỏng vấn luôn phải trong phạm vi khung giờ. 
Phạm vi kiểm tra: Việc chặn đặt lịch test mới khi ca cũ "chưa hoàn thành" sẽ tính theo từng Học sinh
Chỉ quản lý giáo viên hoặc người có quyền mới được đổi giáo viên, trong trường hợp nâng cấp pool để giáo viện tự assign sẽ phát triển sau.
Kiểm tra trùng lịch dạy: Khi chọn gán hoặc đổi giáo viên, hệ thống cần kiểm tra chéo lịch dạy/lịch test khác của giáo viên đó để cảnh báo trùng lịch
Không cần quan tâm Đăng nhập trải nghiệmết bị: Làm thế nào để iPad tại quầy trải nghiệm nhận diện đúng học sinh làm bài.
không cần quan tâm vì nó không thuộc scope Xử lý sự cố mạng: Nếu iPad mất kết nối hoặc sập nguồn giữa ca trải nghiệm, bài làm dở dang có được tự động lưu tạm trên iPad hay không? Thời gian làm bài có được bảo lưu khi khởi động lại không
Logic test ipad gửi bài, logic tính điểm, logic phát hành báo cáo, logic tính toán level hệ thống đều đã có sẵn hệ thống cũ, lấy API
tính năng ghi đè đề xuất level của giáo viên dùng theo logic cũ, không ghi đè.
Giáo viên trùng lịch sẽ được lọc khỏi danh sách đề xuất và tìm kiếm ở modal thêm giáo viên, 
phân quyền đổi giáo viên có ở modal crm rồi, sẽ thêm vào ở 1 thời điểm thích hợp để quản lý
Không, trùng khớp khung giờ luôn, 9h30 rảnh thì khung giờ tiếp theo là 9h40
API sẽ để dev tự làm và xử lý
Nhất quán thông tin học sinh, erp tin tưởng tuyệt đối dữ liệu từ CRM chuyển sang, vì dữ liệu db học sinh là duy nhật từ khi tạo rồi, chỉ chuyển sang thôi. 
Hiển thị thông tin giáo viên trùng lịch, nếu gõ tìm kiếm tên giáo viên trùng thịch trải nghiệmf bị mờ, kèm nhãn trùng lịch: tên ca trùng.
Danh mục dữ liệu nguồn dùng chung lấy từ erp, đã có
không quan tâm giờ bài test, giờ ở trên là biểu diễn giờ phỏng vấn giáo viên, mọi nhân sự phải hiểu đó là giờ phỏng vấn
Trạng thái chính chỉ có 4 trạng thái, booking, đánh giá, hoàn thành, hủy
Các trạng thái ảo là chưa gán gv, đã làm bài, đã phỏng vấn, không đạt, checkin
Về bộ lọc, có thể lọc theo trường, trạng thái, điều kiện khác, giáo viên, ngày trong tuần, chương trình, môn học, sale (Có search), trình độ,
Tìm kiếm, có thể tìm kiếm theo tên học viên, số điện thoại, mã booking, 
Chưa gán giáo viên không thể hiện button icon link bài, những giáo viên, người phụ trách mới được gán mới hiện icon link bài, và chỉ hiện khi booking ở trạng thái đang đánh giá, 
Tên học viên hiện thêm thông tin đã check in "Đã đến" là dạng thẻ tag.
Dữ liệu trả về được mô tả ở us quản lý danh sách test của học sinh. bao gồm cả phần tính toán level và chương trình học và gửi kết quả sang crm.
