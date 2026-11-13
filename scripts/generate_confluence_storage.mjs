import fs from 'fs';

const storageHtml = `
<table data-table-width="760" data-layout="default">
  <colgroup><col style="width: 160.0px;" /><col style="width: 600.0px;" /></colgroup>
  <tbody>
    <tr>
      <th><p><strong>Docs status</strong></p></th>
      <td>
        <p>
          <ac:structured-macro ac:name="status" ac:schema-version="1">
            <ac:parameter ac:name="title">READY</ac:parameter>
            <ac:parameter ac:name="colour">Green</ac:parameter>
            <ac:parameter ac:name="mixedCase">true</ac:parameter>
          </ac:structured-macro>
        </p>
      </td>
    </tr>
    <tr>
      <th><p><strong>Phân hệ &amp; Nghiệp vụ</strong></p></th>
      <td><p>CAP-SYS · BF-SYS-04 (Quản trị Phân hệ &amp; Phạm vi Tác nghiệp Nhân sự)</p></td>
    </tr>
    <tr>
      <th><p><strong>Phiên bản</strong></p></th>
      <td><p>v2026.11.12.01.prod (Cập nhật: 12/11/2026)</p></td>
    </tr>
    <tr>
      <th><p><strong>Màn hình tác nghiệp</strong></p></th>
      <td>
        <p>
          - <code>Quản lý nhân sự</code> (<code>/app/hr_employees</code> trên CRM) &rarr; Hộp thoại <code>Phân loại tác nghiệp</code> / <code>Chọn Trường</code><br/>
          - <code>Cổng Đăng nhập Phân hệ Trực tuyến (Online)</code>: Đăng nhập CRM / ERP / CARE<br/>
          - <code>Cổng Đăng nhập Phân hệ Cơ sở (Station)</code>: Cổng đăng nhập Station mới (nền xanh nhạt)
        </p>
      </td>
    </tr>
  </tbody>
</table>

<h2>1. NHẬT KÝ THAY ĐỔI &amp; BỐI CẢNH (CHANGELOG &amp; CONTEXT)</h2>

<h3>Lịch sử cập nhật tài liệu (Changelog)</h3>
<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Ngày cập nhật</strong></p></th>
      <th><p><strong>Nội dung cập nhật</strong></p></th>
      <th><p><strong>Lý do cập nhật</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p>12/11/2026</p></td>
      <td><p>Bổ sung phân loại phân hệ Trực tuyến (<code>Online</code>) vào danh sách chọn trường/cơ sở tác nghiệp nhân sự. Thiết lập quy tắc mặc định chọn <code>Online</code> cho tài khoản hiện có và tài khoản mới tạo.</p></td>
      <td><p>Đáp ứng nghiệp vụ tách bạch phân hệ Station và phân hệ Online; bảo đảm phân định thẩm quyền tác nghiệp.</p></td>
    </tr>
    <tr>
      <td><p>12/11/2026</p></td>
      <td><p>Thiết lập cơ chế kiểm soát truy cập phân hệ và tự động điều hướng sang cổng đăng nhập Station mới đối với nhân sự chỉ thuộc cơ sở Station.</p></td>
      <td><p>Chặn nhân sự Station truy cập trái phép vào ERP và CARE; tối ưu trải nghiệm đăng nhập đúng phân hệ.</p></td>
    </tr>
  </tbody>
</table>

<h3>Bối cảnh &amp; Vấn đề nghiệp vụ (Context &amp; Problem)</h3>
<ul>
  <li><p><strong>Bối cảnh:</strong> Hệ thống vận hành của tổ chức giáo dục hiện bao gồm 2 phân hệ lớn phục vụ hai mô hình đào tạo:</p>
    <ul>
      <li><p><strong>Phân hệ Trực tuyến (Online):</strong> Bao gồm các ứng dụng tác nghiệp trung tâm như CRM, ERP và CARE, phục vụ đào tạo từ xa và khối vận hành tổng thể.</p></li>
      <li><p><strong>Phân hệ Cơ sở (Station):</strong> Bao gồm giao diện chuyên biệt phục vụ công tác quản lý, giảng dạy, khảo thí và chăm sóc học viên trực tiếp tại các trường học / cơ sở đào tạo thực tế.</p></li>
    </ul>
    <p>Cả hai phân hệ này đều vận hành chung một hệ thống máy chủ và dùng chung cơ sở dữ liệu duy nhất.</p>
  </li>
  <li><p><strong>Vấn đề hiện tại:</strong> Trước đây, toàn bộ nhân sự mặc định hoạt động trên phân hệ Online. Khi xây dựng phân hệ Station và tiến hành phân bổ trường học/cơ sở cho nhân sự, phát sinh rủi ro nhân sự cơ sở (chỉ phụ trách tại các điểm Station) vẫn có thể truy cập vào các phân hệ lõi như ERP và CARE vốn chỉ dành cho khối vận hành tổng thể hoặc nhân sự trực tuyến. Hơn nữa, danh sách phân bổ cơ sở chưa có tùy chọn phân định rõ ràng quyền hạn thuộc phân hệ Online.</p></li>
  <li><p><strong>Mục tiêu &amp; Giá trị mang lại:</strong></p>
    <ol>
      <li><p>Thêm tùy chọn <code>Online</code> trực tiếp vào danh sách phân bổ tác nghiệp để người quản trị dễ dàng kích hoạt hoặc thu hồi quyền truy cập phân hệ Online của từng nhân sự.</p></li>
      <li><p>Thiết lập quy tắc tự động hóa: Tất cả tài khoản hiện có và tài khoản tạo mới luôn mặc định được chọn <code>Online</code>.</p></li>
      <li><p>Kiểm soát quyền truy cập chặt chẽ: Nhân sự không có <code>Online</code> sẽ bị từ chối truy cập vào ERP và CARE; nhân sự không có cơ sở Station sẽ không được truy cập vào hệ thống Station mới; nhân sự có cả hai sẽ truy cập được cả hai.</p></li>
      <li><p>Tự động điều hướng thông minh khi đăng nhập: Nhân sự chỉ có cơ sở Station sẽ được chuyển hướng tự động sang cổng đăng nhập riêng của Station (màn hình màu xanh nhạt) để bắt đầu ca làm việc nhanh chóng.</p></li>
    </ol>
  </li>
</ul>

<h3>Phân loại Rủi ro &amp; Phạm vi Kiểm soát (Risk &amp; Scope)</h3>
<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Tiêu chí đánh giá</strong></p></th>
      <th><p><strong>Nội dung đối soát thực tế</strong></p></th>
      <th style="text-align: center;"><p><strong>Điểm số (0 / 1)</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><strong>Tiêu chí A: Phạm vi ảnh hưởng hệ thống</strong></p></td>
      <td><p>Tác động đến cơ chế xác thực và phân định quyền truy cập giữa 2 phân hệ Online và Station</p></td>
      <td style="text-align: center;"><p>1</p></td>
    </tr>
    <tr>
      <td><p><strong>Tiêu chí B: Tác động tài chính</strong></p></td>
      <td><p>Kiểm soát quyền truy cập hồ sơ học viên, tài chính và hợp đồng trên ERP</p></td>
      <td style="text-align: center;"><p>0</p></td>
    </tr>
    <tr>
      <td><p><strong>Tiêu chí C1: Loại thay đổi nghiệp vụ</strong></p></td>
      <td><p>Bổ sung tùy chọn phân bổ phân hệ mới trên hộp thoại hiện hữu và cơ chế chuyển hướng đăng nhập</p></td>
      <td style="text-align: center;"><p>0</p></td>
    </tr>
    <tr>
      <td><p><strong>Tiêu chí C2: Độ mới nghiệp vụ</strong></p></td>
      <td><p>Nghiệp vụ phân tách quyền truy cập dựa trên phạm vi hoạt động đã có tiền lệ</p></td>
      <td style="text-align: center;"><p>0</p></td>
    </tr>
    <tr>
      <td><p><strong>Tiêu chí D: Phụ thuộc bên ngoài</strong></p></td>
      <td><p>Vận hành hoàn toàn nội bộ, không phụ thuộc dịch vụ đối tác ngoài</p></td>
      <td style="text-align: center;"><p>0</p></td>
    </tr>
  </tbody>
</table>
<p><strong>Tổng điểm đánh giá:</strong> 1/5 điểm &rarr; <ac:structured-macro ac:name="status"><ac:parameter ac:name="title">RISK</ac:parameter><ac:parameter ac:name="colour">Red</ac:parameter></ac:structured-macro> (Yêu cầu Quản lý Dự án và Trưởng nhóm Kỹ thuật phê duyệt trước khi phát hành).</p>

<h3>Bảng Danh mục Chức năng (Feature Scope Matrix)</h3>
<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Mã Yêu Cầu</strong></p></th>
      <th><p><strong>Tên Chức Năng</strong></p></th>
      <th><p><strong>Mức Độ Ưu Tiên</strong></p></th>
      <th><p><strong>Phân Loại Rủi Ro</strong></p></th>
      <th><p><strong>Ghi Chú Nghiệp Vụ</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><strong>FEAT-01</strong></p></td>
      <td><p>Bổ sung tùy chọn <code>Online</code> vào danh sách phân bổ tác nghiệp</p></td>
      <td><p>Bắt buộc (Must)</p></td>
      <td><p>Risk</p></td>
      <td><p>Đứng đầu danh sách, mặc định tích chọn</p></td>
    </tr>
    <tr>
      <td><p><strong>FEAT-02</strong></p></td>
      <td><p>Mặc định tích chọn <code>Online</code> cho tài khoản hiện có và tài khoản mới</p></td>
      <td><p>Bắt buộc (Must)</p></td>
      <td><p>Standard</p></td>
      <td><p>Bảo đảm kế thừa thông suốt</p></td>
    </tr>
    <tr>
      <td><p><strong>FEAT-03</strong></p></td>
      <td><p>Cơ chế phân quyền truy cập phân hệ (Online / Station)</p></td>
      <td><p>Bắt buộc (Must)</p></td>
      <td><p>Risk</p></td>
      <td><p>Chặn Station vào ERP/CARE, chặn Online vào Station</p></td>
    </tr>
    <tr>
      <td><p><strong>FEAT-04</strong></p></td>
      <td><p>Tự động chuyển hướng đăng nhập cho nhân sự chuyên trách Station</p></td>
      <td><p>Bắt buộc (Must)</p></td>
      <td><p>Risk</p></td>
      <td><p>Chuyển hướng sang màn hình đăng nhập Station mới</p></td>
    </tr>
    <tr>
      <td><p><strong>FEAT-05</strong></p></td>
      <td><p>Màn hình cảnh báo từ chối truy cập khi vào sai phân hệ</p></td>
      <td><p>Bắt buộc (Must)</p></td>
      <td><p>Standard</p></td>
      <td><p>Hiển thị thông báo và nút quay về cổng hợp lệ</p></td>
    </tr>
  </tbody>
</table>

<h3>Chỉ số Đo lường Hiệu quả (KPI Target)</h3>
<ul>
  <li><p><strong>Chỉ số Baseline:</strong> 100% nhân sự cơ sở Station trước đây có nguy cơ truy cập chéo vào các màn hình quản trị ERP/CARE do chưa có bộ lọc phân hệ.</p></li>
  <li><p><strong>Mục tiêu Kỳ vọng (Target):</strong> 0% trường hợp nhân sự Station truy cập trái phép vào ERP/CARE; 100% nhân sự Station được tự động chuyển hướng đúng cổng đăng nhập mới ngay trong lần truy cập đầu tiên.</p></li>
  <li><p><strong>Cách thức đo lường:</strong> Giám sát nhật ký truy cập hệ thống và số lượng yêu cầu bị chặn bởi bộ lọc kiểm soát phân hệ.</p></li>
</ul>

<ac:structured-macro ac:name="info">
  <ac:parameter ac:name="title">Ràng buộc Nghiệp vụ Toàn cục (Global Rules)</ac:parameter>
  <ac:rich-text-body>
    <p><strong>[RULE-SYS-01] Mặc định tích chọn Online cho toàn bộ tài khoản:</strong> Toàn bộ tài khoản nhân sự hiện đang có trên hệ thống khi mở hộp thoại phân bổ trường/cơ sở đều được hệ thống tự động gán sẵn trạng thái tích chọn <code>[x] Online</code>. Đối với tất cả tài khoản nhân sự tạo mới sau này, hệ thống luôn tự động đặt giá trị mặc định là đã chọn <code>[x] Online</code>.</p>
    <p><strong>[RULE-SYS-02] Ma trận kiểm soát truy cập phân hệ (Subsystem Access Control):</strong></p>
    <ul>
      <li><p><strong>Trường hợp 1 (Chỉ có Online - Không có cơ sở Station):</strong> Được phép đăng nhập và tác nghiệp trên hệ thống <code>ERP</code> và <code>CARE</code>. Bị chặn hoàn toàn khỏi hệ thống <code>Station</code>.</p></li>
      <li><p><strong>Trường hợp 2 (Chỉ có cơ sở Station - Không có Online):</strong> Được phép đăng nhập và tác nghiệp trên hệ thống <code>Station</code> (theo đúng danh sách cơ sở được gán). Tuyệt đối <strong>KHÔNG</strong> được truy cập vào hệ thống <code>ERP</code> và <code>CARE</code>.</p></li>
      <li><p><strong>Trường hợp 3 (Có cả Online VÀ cơ sở Station):</strong> Được phép truy cập đồng thời cả 2 phân hệ (<code>ERP</code>, <code>CARE</code> và <code>Station</code>).</p></li>
      <li><p><strong>Trường hợp 4 (Không có Online VÀ Không có cơ sở Station):</strong> Tài khoản bị vô hiệu hóa quyền tác nghiệp, không thể đăng nhập vào bất kỳ phân hệ nào.</p></li>
    </ul>
    <p><strong>[RULE-SYS-03] Cơ chế tự động điều hướng khi đăng nhập:</strong> Khi nhân sự đã được gán cơ sở Station nhưng KHÔNG được gán Online thực hiện đăng nhập hoặc truy cập cổng đăng nhập CRM/ERP, hệ thống tự động nhận diện thẩm quyền và điều hướng người dùng sang cổng đăng nhập riêng biệt của phân hệ Station (màn hình đăng nhập mới, nền xanh nhạt). Nếu nhân sự này cố tình truy cập các đường dẫn chức năng của ERP/CARE, hệ thống lập tức hiển thị thông báo từ chối truy cập.</p>
    <p><strong>[RULE-SYS-04] Cơ sở dữ liệu dùng chung &amp; Không phát sinh tiến trình chuyển giao trung gian:</strong> Hai phân hệ vận hành trên cùng một cơ sở dữ liệu người dùng và phiên làm việc; mọi thao tác thay đổi phân bổ có hiệu lực tức thời mà không cần qua tiến trình đồng bộ dữ liệu trung gian.</p>
    <p><strong>[RULE-SYS-05] Che số điện thoại chống sao chép hàng loạt:</strong> Trên bảng danh sách nhân sự chính, số điện thoại của nhân sự bắt buộc phải được che ẩn ở giữa theo định dạng <code>091****111</code> để phòng ngừa hành vi sao chép dữ liệu hàng loạt.</p>
  </ac:rich-text-body>
</ac:structured-macro>

<hr/>

<h2>2. MÔ TẢ GIAO DIỆN &amp; CÁC THAY ĐỔI</h2>

<h3>2.1 Hộp thoại "Phân loại tác nghiệp" / "Chọn Trường" - Các điều chỉnh</h3>

<p><strong>Minh họa 2 trạng thái phân bổ tác nghiệp:</strong></p>
<table data-layout="default">
  <thead>
    <tr>
      <th style="width: 50%;"><p><strong>Trạng thái 1: ĐÃ CHỌN Online (Mặc định)</strong></p></th>
      <th style="width: 50%;"><p><strong>Trạng thái 2: BỎ CHỌN Online &amp; Gán Cơ sở Station</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p><em>(Tài khoản có quyền vào ERP/CARE. Chưa gán Station nên không được vào Station)</em></p>
        <p><strong>[✔] Online</strong></p>
        <p>[ ] CS1 Linh Đàm</p>
        <p>[ ] CS3 Vinsmart SA</p>
        <p>[ ] CS5 47 Nguyễn Tuân</p>
        <p>[ ] CS6 Vinsmart Tonkin</p>
        <p>[ ] CS7 170 Nguyễn Tuân</p>
      </td>
      <td>
        <p><em>(Nhân sự chuyên trách Station. Bị chặn khỏi ERP/CARE; tự động chuyển sang Login Station mới)</em></p>
        <p>[ ] Online <em>(Đã bỏ chọn)</em></p>
        <p><strong>[✔] CS1 Linh Đàm</strong></p>
        <p>[ ] CS3 Vinsmart SA</p>
        <p><strong>[✔] CS5 47 Nguyễn Tuân</strong></p>
        <p>[ ] CS6 Vinsmart Tonkin</p>
        <p>[ ] CS7 170 Nguyễn Tuân</p>
      </td>
    </tr>
  </tbody>
</table>

<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Thành phần giao diện</strong></p></th>
      <th><p><strong>Loại hiển thị</strong></p></th>
      <th><p><strong>Dữ liệu &amp; Quy tắc</strong></p></th>
      <th><p><strong>Diễn giải quy tắc</strong></p></th>
      <th><p><strong>Nội dung điều chỉnh</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><strong>Tùy chọn Phân hệ Trực tuyến (<code>Online</code>)</strong></p></td>
      <td><p>Hộp kiểm kèm nhãn văn bản</p></td>
      <td><p>Nhãn <code>Online</code>, nằm ở dòng đầu tiên trong danh sách chọn trường/cơ sở</p></td>
      <td><p>Cho phép tích chọn hoặc bỏ tích chọn. Khi được chọn, nhân sự có quyền truy cập phân hệ trực tuyến (ERP, CARE). Mặc định luôn được tích chọn cho tài khoản hiện có và tài khoản mới.</p></td>
      <td><p><strong>Bổ sung:</strong> Bổ sung dòng lựa chọn <code>Online</code> lên vị trí đầu tiên của danh sách để phân định thẩm quyền phân hệ trực tuyến.</p></td>
    </tr>
    <tr>
      <td><p><strong>Danh sách Cơ sở Đào tạo (<code>Station</code>)</strong></p></td>
      <td><p>Danh sách hộp kiểm có thanh cuộn</p></td>
      <td><p>Tên các cơ sở thực tế: <code>CS1 Linh Đàm</code>, <code>CS3 Vinsmart SA</code>, <code>CS5 47 Nguyễn Tuân</code>, <code>CS6 Vinsmart Tonkin</code>, <code>CS7 170 Nguyễn Tuân</code>, <code>Trường Tech Test</code>...</p></td>
      <td><p>Cho phép chọn một hoặc nhiều cơ sở đào tạo. Nhân sự được chọn cơ sở nào sẽ được cấp quyền tác nghiệp tại cơ sở đó trên phân hệ Station.</p></td>
      <td><p><strong>Điều chỉnh:</strong> Giữ nguyên danh sách các cơ sở hiện tại, hiển thị bên dưới dòng <code>Online</code> trong cùng khung cuộn.</p></td>
    </tr>
    <tr>
      <td><p><strong>Dòng chỉ báo "Chọn Trường"</strong></p></td>
      <td><p>Thanh viền màu kèm mũi tên mở rộng</p></td>
      <td><p>Văn bản chỉ dẫn <code>Chọn Trường</code> cùng đường viền màu hồng sen nổi bật</p></td>
      <td><p>Thể hiện trạng thái mở rộng hoặc thu gọn của danh sách chọn trường/cơ sở tác nghiệp.</p></td>
      <td><p><strong>Điều chỉnh:</strong> Giữ nguyên kiểu hiển thị nhận diện thương hiệu truyền thống của hệ thống quản lý nhân sự.</p></td>
    </tr>
    <tr>
      <td><p><strong>Nút bấm "LƯU LẠI"</strong></p></td>
      <td><p>Nút bấm chính bo góc, màu xanh lá cây</p></td>
      <td><p>Lưu các phân bổ cơ sở và phân hệ vừa chọn vào hồ sơ nhân sự</p></td>
      <td><p>Kích hoạt lưu trữ các giá trị đã tích chọn vào cơ sở dữ liệu nhân sự và cập nhật quyền hạn tác nghiệp.</p></td>
      <td><p><strong>Điều chỉnh:</strong> Giữ nguyên vị trí và kiểu dáng nút thao tác chính.</p></td>
    </tr>
    <tr>
      <td><p><strong>Nút bấm "HỦY BỎ"</strong></p></td>
      <td><p>Nút bấm phụ bo góc, màu hồng sen</p></td>
      <td><p>Đóng hộp thoại và hủy bỏ các thay đổi đang chọn</p></td>
      <td><p>Đóng hộp thoại nổi, khôi phục lại các giá trị cấu hình ban đầu trước khi mở hộp thoại.</p></td>
      <td><p><strong>Điều chỉnh:</strong> Giữ nguyên vị trí và kiểu dáng nút thao tác phụ.</p></td>
    </tr>
  </tbody>
</table>

<h3>2.2 Cổng Đăng nhập Phân hệ Trực tuyến (CRM / ERP / CARE) &amp; Cổng Đăng nhập Station Mới</h3>

<table data-layout="default">
  <thead>
    <tr>
      <th style="width: 50%;"><p><strong>Cổng Đăng nhập Phân hệ Trực tuyến (ERP/CARE)</strong></p></th>
      <th style="width: 50%;"><p><strong>Cổng Đăng nhập Phân hệ Station Mới</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <p>Giao diện nền tối truyền thống của CRM/ERP</p>
        <p>Dành cho: Nhân sự có quyền <code>Online</code></p>
      </td>
      <td>
        <p>Giao diện nền xanh nhạt hiện đại, biểu tượng linh vật RinoEdu</p>
        <p>Dành cho: Nhân sự có quyền <code>Station</code></p>
      </td>
    </tr>
  </tbody>
</table>

<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Thành phần giao diện</strong></p></th>
      <th><p><strong>Loại hiển thị</strong></p></th>
      <th><p><strong>Dữ liệu &amp; Quy tắc</strong></p></th>
      <th><p><strong>Diễn giải quy tắc</strong></p></th>
      <th><p><strong>Nội dung điều chỉnh</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><strong>Cổng Đăng nhập Station Mới</strong></p></td>
      <td><p>Màn hình đăng nhập đầy đủ, nền xanh nhạt bo góc</p></td>
      <td><p>Biểu tượng thương hiệu nhận diện mới, tiêu đề <code>Đăng nhập RinoEdu</code>, dòng phụ <code>Sử dụng tài khoản nội bộ để truy cập hệ thống</code></p></td>
      <td><p>Dành riêng cho nhân sự tác nghiệp tại cơ sở Station. Tiếp nhận thông tin định danh và mật khẩu nội bộ.</p></td>
      <td><p><strong>Bổ sung:</strong> Tiếp nhận luồng tự động chuyển hướng từ hệ thống khi nhân sự chỉ có cơ sở Station thực hiện đăng nhập.</p></td>
    </tr>
    <tr>
      <td><p><strong>Cơ chế Tự động Điều hướng Đăng nhập</strong></p></td>
      <td><p>Luồng xử lý điều hướng ngầm của hệ thống</p></td>
      <td><p>Dựa trên phân bổ phân hệ trong hồ sơ nhân sự</p></td>
      <td><p>Khi nhân sự chỉ được gán cơ sở Station (không có Online) đăng nhập vào cổng chung hoặc cổng ERP, hệ thống tự động nhận diện và chuyển hướng ngay sang Cổng Đăng nhập Station Mới.</p></td>
      <td><p><strong>Bổ sung:</strong> Luồng kiểm tra quyền phân hệ tại cổng đăng nhập và điều hướng tự động đến đúng màn hình đăng nhập tương ứng.</p></td>
    </tr>
    <tr>
      <td><p><strong>Màn hình Cảnh báo Từ chối Truy cập</strong></p></td>
      <td><p>Bảng thông báo toàn trang bo góc</p></td>
      <td><p>Tiêu đề cảnh báo quyền hạn, biểu tượng khóa bảo mật, nút quay lại cổng đăng nhập hợp lệ</p></td>
      <td><p>Hiển thị khi nhân sự cố tình truy cập trực tiếp bằng đường dẫn liên kết vào phân hệ không có quyền (ví dụ nhân sự Station vào ERP hoặc nhân sự Online vào Station).</p></td>
      <td><p><strong>Bổ sung:</strong> Màn hình thông báo chuẩn mực ngăn chặn hành vi truy cập sai phân hệ được cấp phép.</p></td>
    </tr>
  </tbody>
</table>

<hr/>

<h2>3. KHỐI CHỨC NĂNG CHI TIẾT: ACTION &amp; LUỒNG KÍCH HOẠT (ACTIONS &amp; EVENTS)</h2>

<h3>Sơ đồ Luồng Nghiệp vụ (Mermaid Flow)</h3>

<ac:structured-macro ac:name="code" ac:schema-version="1">
  <ac:parameter ac:name="language">text</ac:parameter>
  <ac:plain-text-body><![CDATA[sequenceDiagram
    autonumber
    actor Admin as Quản trị viên Nhân sự
    actor Staff as Nhân sự (Người dùng)
    participant CRM as Giao diện Quản lý Nhân sự CRM
    participant Login as Cổng Đăng nhập Hệ thống
    participant Auth as Hệ thống Xác thực & Phân quyền
    participant StationUI as Giao diện Phân hệ Station (Mới)
    participant ERPUI as Giao diện Phân hệ Online (ERP/CARE)

    Note over Admin,CRM: 1. Gán phân hệ & Cơ sở tác nghiệp
    Admin->>CRM: Mở hộp thoại "Phân loại tác nghiệp" của nhân sự
    CRM-->>Admin: Hiển thị danh sách gồm [Online] và các cơ sở Station
    Admin->>CRM: Tích chọn hoặc bỏ chọn [Online] và các cơ sở Station, bấm [LƯU LẠI]
    CRM->>Auth: Gọi đến cơ sở dữ liệu nhân sự để cập nhật thẩm quyền phân hệ
    Auth-->>CRM: Xác nhận lưu phân bổ thành công

    Note over Staff,ERPUI: 2. Luồng Đăng nhập & Điều hướng Phân hệ
    Staff->>Login: Nhập tên đăng nhập và mật khẩu
    Login->>Auth: Kiểm tra thông tin tài khoản và phạm vi phân hệ được gán
    alt Trường hợp 1: Có Online và Không có Station
        Auth-->>Login: Phản hồi thẩm quyền: Chỉ có Online
        Login->>ERPUI: Cho phép truy cập và chuyển hướng vào màn hình làm việc ERP/CARE
    else Trường hợp 2: Chỉ có Station và Không có Online
        Auth-->>Login: Phản hồi thẩm quyền: Chỉ có Station
        Login->>StationUI: Tự động điều hướng sang Cổng Đăng nhập Station Mới (Màn hình xanh)
        StationUI-->>Staff: Mở giao diện làm việc các cơ sở Station được phân bổ
    else Trường hợp 3: Có cả Online và Station
        Auth-->>Login: Phản hồi thẩm quyền: Cả hai phân hệ
        Login-->>Staff: Cho phép đăng nhập và tác nghiệp trên cả ERP/CARE và Station
    else Trường hợp 4: Không có cả hai
        Auth-->>Login: Phản hồi thẩm quyền: Không có quyền tác nghiệp
        Login-->>Staff: Hiển thị thông báo tài khoản chưa được phân bổ phạm vi hoạt động
    end]]></ac:plain-text-body>
</ac:structured-macro>

<h3>Khối chức năng 1: Phân bổ Phân hệ và Cơ sở Tác nghiệp trên CRM</h3>

<h4>Action 1.1: Mở Hộp thoại Phân bổ Cơ sở Tác nghiệp</h4>
<p><strong>Luồng kích hoạt:</strong> Quản trị viên nhấn vào thao tác sửa hoặc cấu hình phân loại tác nghiệp của một nhân sự trên danh sách nhân sự CRM.</p>
<p><strong>Tiêu chí nghiệm thu (Acceptance Criteria):</strong></p>
<ul>
  <li><p><strong>AC-1.1.1 (Happy Path - Mặc định tích chọn Online cho tài khoản hiện có):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Quản trị viên mở hộp thoại cấu hình tác nghiệp cho một tài khoản nhân sự đang hoạt động trên hệ thống.</p></li>
      <li><p><strong>Khi:</strong> Hộp thoại "Phân loại tác nghiệp" / "Chọn Trường" hiển thị.</p></li>
      <li><p><strong>Thì:</strong> Tùy chọn <code>Online</code> nằm ngay tại dòng đầu tiên và ở trạng thái đã được tích chọn <code>[x] Online</code>; các cơ sở Station bên dưới giữ nguyên trạng thái phân bổ đã lưu trước đó.</p></li>
    </ul>
  </li>
  <li><p><strong>AC-1.1.2 (Happy Path - Mặc định tích chọn Online cho tài khoản mới tạo):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Quản trị viên thực hiện tạo mới một hồ sơ nhân sự trên hệ thống.</p></li>
      <li><p><strong>Khi:</strong> Quản trị viên tiến hành cấu hình trường học/cơ sở tác nghiệp cho tài khoản mới.</p></li>
      <li><p><strong>Thì:</strong> Tùy chọn <code>Online</code> luôn tự động được tích chọn sẵn; quản trị viên có thể giữ nguyên hoặc chủ động nhấn bỏ chọn theo nhu cầu phân công.</p></li>
    </ul>
  </li>
</ul>

<h4>Action 1.2: Lưu Cấu hình Phân bổ Phân hệ và Cơ sở</h4>
<p><strong>Luồng kích hoạt:</strong> Quản trị viên điều chỉnh tích chọn / bỏ chọn <code>Online</code> hoặc các cơ sở Station, sau đó nhấn nút "LƯU LẠI".</p>
<p><strong>Tiêu chí nghiệm thu:</strong></p>
<ul>
  <li><p><strong>AC-1.2.1 (Happy Path - Lưu thành công cấu hình phân hệ và cơ sở):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Quản trị viên đã bỏ tích chọn <code>Online</code> và tích chọn cơ sở <code>CS1 Linh Đàm</code> cùng <code>CS5 47 Nguyễn Tuân</code> cho nhân sự chuyên trách cơ sở.</p></li>
      <li><p><strong>Khi:</strong> Quản trị viên nhấn nút "LƯU LẠI".</p></li>
      <li><p><strong>Thì:</strong> Hệ thống gửi yêu cầu cập nhật hồ sơ, gọi đến cơ sở dữ liệu nhân sự để ghi nhận các giá trị mới; hộp thoại đóng lại và hiển thị thông báo cập nhật thành công.</p></li>
    </ul>
  </li>
  <li><p><strong>AC-1.2.2 (Happy Path - Hủy bỏ thao tác cấu hình):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Quản trị viên đã thay đổi một số ô tích chọn nhưng quyết định không lưu thay đổi.</p></li>
      <li><p><strong>Khi:</strong> Quản trị viên nhấn nút "HỦY BỎ" hoặc nhấn biểu tượng đóng hộp thoại.</p></li>
      <li><p><strong>Thì:</strong> Toàn bộ các thay đổi chưa lưu bị hủy bỏ; hệ thống giữ nguyên cấu hình cũ đã có trong cơ sở dữ liệu.</p></li>
    </ul>
  </li>
</ul>

<h3>Khối chức năng 2: Kiểm soát Thẩm quyền Truy cập Phân hệ &amp; Điều hướng Đăng nhập</h3>

<h4>Action 2.1: Đăng nhập của Nhân sự Thuần Phân hệ Trực tuyến (Chỉ có Online)</h4>
<p><strong>Luồng kích hoạt:</strong> Nhân sự chỉ được phân bổ <code>Online</code> (không được gán cơ sở Station nào) thực hiện đăng nhập vào hệ thống.</p>
<p><strong>Tiêu chí nghiệm thu:</strong></p>
<ul>
  <li><p><strong>AC-2.1.1 (Happy Path - Đăng nhập thành công vào ERP / CARE):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Nhân sự được tích chọn <code>Online</code> và không có cơ sở Station.</p></li>
      <li><p><strong>Khi:</strong> Nhân sự đăng nhập thông tin định danh hợp lệ tại cổng đăng nhập trực tuyến.</p></li>
      <li><p><strong>Thì:</strong> Hệ thống xác thực thành công và đưa nhân sự vào giao diện làm việc của ERP / CARE theo đúng chức năng được cấp.</p></li>
    </ul>
  </li>
  <li><p><strong>AC-2.1.2 (Exception Path - Chặn truy cập hệ thống Station):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Nhân sự chỉ có <code>Online</code> cố tình đăng nhập hoặc mở đường dẫn của hệ thống Station mới.</p></li>
      <li><p><strong>Khi:</strong> Hệ thống kiểm tra thẩm quyền phân bổ cơ sở của phiên làm việc.</p></li>
      <li><p><strong>Thì:</strong> Hệ thống từ chối truy cập và hiển thị thông báo tài khoản chưa được gán cơ sở đào tạo nào thuộc hệ thống Station.</p></li>
    </ul>
  </li>
</ul>

<h4>Action 2.2: Đăng nhập của Nhân sự Chuyên trách Cơ sở (Chỉ có Cơ sở Station)</h4>
<p><strong>Luồng kích hoạt:</strong> Nhân sự đã được gán một hoặc nhiều cơ sở Station nhưng KHÔNG được gán <code>Online</code> thực hiện đăng nhập.</p>
<p><strong>Tiêu chí nghiệm thu:</strong></p>
<ul>
  <li><p><strong>AC-2.2.1 (Happy Path - Tự động điều hướng sang Cổng Đăng nhập Station Mới):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Nhân sự chỉ có cơ sở Station và không có <code>Online</code> mở cổng đăng nhập chung hoặc cổng ERP.</p></li>
      <li><p><strong>Khi:</strong> Nhân sự nhập thông tin định danh hoặc hệ thống nhận diện thẩm quyền tài khoản.</p></li>
      <li><p><strong>Thì:</strong> Hệ thống tự động chuyển hướng người dùng sang Cổng Đăng nhập Station Mới (màn hình nền xanh nhạt); sau khi xác thực thành công, nhân sự được đưa vào màn hình tác nghiệp Station của đúng các cơ sở đã được gán.</p></li>
    </ul>
  </li>
  <li><p><strong>AC-2.2.2 (Exception Path - Chặn hoàn toàn khỏi ERP và CARE):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Nhân sự Station cố tình truy cập vào các đường dẫn tác nghiệp của ERP hoặc CARE (bằng đường dẫn lưu sẵn hoặc lưu trong lịch sử duyệt web).</p></li>
      <li><p><strong>Khi:</strong> Hệ thống máy chủ kiểm tra phiên làm việc và thẩm quyền phân hệ.</p></li>
      <li><p><strong>Thì:</strong> Hệ thống lập tức chặn yêu cầu, không trả về dữ liệu nghiệp vụ và chuyển hướng người dùng về màn hình cảnh báo không có quyền truy cập phân hệ trực tuyến.</p></li>
    </ul>
  </li>
</ul>

<h4>Action 2.3: Đăng nhập của Nhân sự Kiêm nhiệm Cả Hai Phân hệ (Có cả Online và Station)</h4>
<p><strong>Luồng kích hoạt:</strong> Nhân sự được gán đồng thời <code>Online</code> và một hoặc nhiều cơ sở Station thực hiện đăng nhập.</p>
<p><strong>Tiêu chí nghiệm thu:</strong></p>
<ul>
  <li><p><strong>AC-2.3.1 (Happy Path - Tác nghiệp song song trên cả hai phân hệ):</strong></p>
    <ul>
      <li><p><strong>Giả sử:</strong> Nhân sự quản lý chung được phân bổ cả <code>Online</code> lẫn cơ sở <code>CS1 Linh Đàm</code>.</p></li>
      <li><p><strong>Khi:</strong> Nhân sự đăng nhập vào ERP/CARE hoặc phân hệ Station.</p></li>
      <li><p><strong>Thì:</strong> Hệ thống xác thực hợp lệ trên cả hai cổng; nhân sự có thể làm việc trên ERP/CARE để xử lý công việc tổng thể và mở phân hệ Station để kiểm tra công tác đào tạo tại cơ sở mà không gặp bất kỳ trở ngại phân quyền nào.</p></li>
    </ul>
  </li>
</ul>

<hr/>

<h2>4. CÁC TRƯỜNG HỢP GÓC CẠNH &amp; LUỒNG NGOẠI LỆ (CORNER CASES &amp; EXCEPTION FLOWS)</h2>

<h3>Nhóm 1: Kiểm soát Quyền hạn &amp; Điều hướng Ngoại lệ</h3>
<ul>
  <li><p><strong>[CASE-01] Tài khoản không được tích chọn bất kỳ phân hệ nào (Bỏ cả Online lẫn Station):</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Quản trị viên bỏ tích chọn <code>Online</code> đồng thời không tích chọn bất kỳ cơ sở Station nào cho nhân sự.</p></li>
      <li><p><strong>Xử lý:</strong> Khi người dùng này đăng nhập, hệ thống hiển thị thông báo tài khoản chưa được phân bổ phạm vi hoạt động; từ chối cấp quyền truy cập vào cả hai phân hệ cho đến khi quản trị viên phân bổ lại.</p></li>
    </ul>
  </li>
  <li><p><strong>[CASE-02] Nhân sự Station truy cập trực tiếp bằng đường dẫn lưu trữ cá nhân (Bookmark / Direct URL) vào ERP/CARE:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Nhân sự Station đã từng làm việc trên hệ thống cũ và lưu các đường dẫn cụ thể của ERP hoặc CARE trong danh mục yêu thích trình duyệt, sau đó nhấp mở trực tiếp.</p></li>
      <li><p><strong>Xử lý:</strong> Bộ lọc kiểm soát thẩm quyền tại máy chủ nhận diện tài khoản không có quyền <code>Online</code>, lập tức chặn hiển thị nội dung trang và điều hướng tự động sang Cổng Đăng nhập Station Mới hoặc trang thông báo từ chối truy cập.</p></li>
    </ul>
  </li>
  <li><p><strong>[CASE-03] Nhân sự Online truy cập trực tiếp đường dẫn của phân hệ Station:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Nhân sự thuần trực tuyến mở liên kết đến phân hệ Station của cơ sở đào tạo.</p></li>
      <li><p><strong>Xử lý:</strong> Giao diện Station kiểm tra danh sách cơ sở được phân bổ, phát hiện danh sách rỗng nên hiển thị màn hình thông báo: "Tài khoản của bạn chưa được gán cơ sở hoạt động trên phân hệ Station. Vui lòng liên hệ quản trị viên".</p></li>
    </ul>
  </li>
</ul>

<h3>Nhóm 2: Đồng bộ Phiên làm việc &amp; Thao tác Quản trị</h3>
<ul>
  <li><p><strong>[CASE-04] Quản trị viên thu hồi quyền Online khi nhân sự đang trong phiên làm việc trên ERP/CARE:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Nhân sự đang mở giao diện ERP/CARE thao tác, cùng lúc đó quản trị viên bỏ chọn <code>Online</code> của tài khoản này trên CRM và bấm Lưu lại.</p></li>
      <li><p><strong>Xử lý:</strong> Tại lần gửi yêu cầu thao tác hoặc tải lại trang tiếp theo, hệ thống máy chủ kiểm tra lại thẩm quyền trong cơ sở dữ liệu, nhận thấy quyền <code>Online</code> đã bị thu hồi; lập tức kết thúc phiên làm việc trên ERP/CARE và điều hướng nhân sự sang cổng đăng nhập Station.</p></li>
    </ul>
  </li>
  <li><p><strong>[CASE-05] Nhân sự có cả hai phân hệ thực hiện đổi mật khẩu tài khoản:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Nhân sự được phân bổ cả hai phân hệ thực hiện đổi mật khẩu trên giao diện Station hoặc giao diện ERP.</p></li>
      <li><p><strong>Xử lý:</strong> Do hệ thống dùng chung một cơ sở dữ liệu người dùng, mật khẩu mới có hiệu lực tức thời cho cả hai cổng đăng nhập; người dùng sử dụng mật khẩu mới để đăng nhập vào bất kỳ phân hệ nào.</p></li>
    </ul>
  </li>
  <li><p><strong>[CASE-06] Tạo mới tài khoản hàng loạt hoặc tạo mới đơn lẻ trên CRM:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Quản trị viên tiến hành tạo mới tài khoản nhân sự từ biểu mẫu thêm mới nhân sự.</p></li>
      <li><p><strong>Xử lý:</strong> Cơ chế khởi tạo hồ sơ luôn tự động gán giá trị mặc định <code>Online = true</code> trong cơ sở dữ liệu nhân sự, bảo đảm không làm gián đoạn quy trình tiếp nhận nhân sự mới.</p></li>
    </ul>
  </li>
</ul>

<h3>Nhóm 3: Tương tác Giao diện &amp; Hiển thị Danh sách</h3>
<ul>
  <li><p><strong>[CASE-07] Tìm kiếm và cuộn danh sách trong hộp thoại khi số lượng cơ sở đào tạo lớn:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Danh sách cơ sở Station mở rộng lên hàng chục cơ sở khiến khung danh sách phát sinh thanh cuộn dài.</p></li>
      <li><p><strong>Xử lý:</strong> Tùy chọn <code>Online</code> luôn được cố định ở vị trí hàng đầu tiên; thanh cuộn chỉ áp dụng cho danh sách các cơ sở bên dưới, giúp người quản trị dễ dàng quan sát và thao tác mà không bị trôi mất ô chọn <code>Online</code>.</p></li>
    </ul>
  </li>
  <li><p><strong>[CASE-08] Gián đoạn kết nối mạng khi đang lưu phân bổ cơ sở:</strong></p>
    <ul>
      <li><p><strong>Tình huống:</strong> Quản trị viên bấm "LƯU LẠI" nhưng đường truyền mạng bị ngắt kết nối.</p></li>
      <li><p><strong>Xử lý:</strong> Giao diện hiển thị thông báo lỗi kết nối tạm thời, không đóng hộp thoại và giữ nguyên toàn bộ các ô đã tích chọn để người quản trị có thể bấm thử lại ngay khi mạng phục hồi.</p></li>
    </ul>
  </li>
</ul>

<hr/>

<h2>5. RÀNG BUỘC DỮ LIỆU &amp; QUY TẮC KIỂM SOÁT (VALIDATION RULES)</h2>

<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Tên trường dữ liệu</strong></p></th>
      <th><p><strong>Kiểu dữ liệu</strong></p></th>
      <th style="text-align: center;"><p><strong>Bắt buộc</strong></p></th>
      <th><p><strong>Giá trị mặc định</strong></p></th>
      <th><p><strong>Quy tắc kiểm soát dữ liệu</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><code>is_online</code></p></td>
      <td><p>Đúng / Sai (<code>boolean</code>)</p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td><p><code>true</code> (Đã chọn)</p></td>
      <td><p>Xác định thẩm quyền phân hệ trực tuyến. Mặc định là <code>true</code> khi tạo mới tài khoản.</p></td>
    </tr>
    <tr>
      <td><p><code>station_branch_ids</code></p></td>
      <td><p>Danh sách chuỗi ký tự</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td><p>Rỗng (<code>[]</code>)</p></td>
      <td><p>Danh sách mã định danh các cơ sở Station mà nhân sự được phép tác nghiệp.</p></td>
    </tr>
    <tr>
      <td><p><code>selected_branches_count</code></p></td>
      <td><p>Số nguyên</p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td><p>0</p></td>
      <td><p>Tổng số lượng cơ sở được chọn; tự động tính toán lại khi người dùng tích chọn hoặc bỏ chọn.</p></td>
    </tr>
  </tbody>
</table>

<hr/>

<h2>6. MA TRẬN PHÂN QUYỀN VAI TRÒ (PERMISSION MATRIX)</h2>

<table data-layout="default">
  <thead>
    <tr>
      <th><p><strong>Hành động tác nghiệp</strong></p></th>
      <th style="text-align: center;"><p><strong>Quản trị viên Hệ thống</strong></p></th>
      <th style="text-align: center;"><p><strong>Quản lý Cơ sở</strong></p></th>
      <th style="text-align: center;"><p><strong>Nhân sự Station</strong></p></th>
      <th style="text-align: center;"><p><strong>Nhân sự Online</strong></p></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><p><strong>Xem danh sách phân bổ nhân sự</strong></p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Có (trong cơ sở)</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td style="text-align: center;"><p>Không</p></td>
    </tr>
    <tr>
      <td><p><strong>Cấu hình gán / bỏ chọn Online</strong></p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td style="text-align: center;"><p>Không</p></td>
    </tr>
    <tr>
      <td><p><strong>Cấu hình gán cơ sở Station</strong></p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td style="text-align: center;"><p>Không</p></td>
    </tr>
    <tr>
      <td><p><strong>Đăng nhập vào hệ thống ERP / CARE</strong></p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Không (nếu không có Online)</p></td>
      <td style="text-align: center;"><p>Không</p></td>
      <td style="text-align: center;"><p>Có</p></td>
    </tr>
    <tr>
      <td><p><strong>Đăng nhập vào hệ thống Station</strong></p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Có</p></td>
      <td style="text-align: center;"><p>Không (nếu không có cơ sở)</p></td>
    </tr>
  </tbody>
</table>

<hr/>

<h2>7. YÊU CẦU PHI CHỨC NĂNG (NON-FUNCTIONAL REQUIREMENTS)</h2>
<ul>
  <li><p><strong>Thời gian phản hồi:</strong> Thao tác lưu phân bổ cơ sở tác nghiệp hoàn tất trong thời gian dưới 1 giây đối với mạng nội bộ. Thời gian nhận diện thẩm quyền và chuyển hướng đăng nhập dưới 800 phần nghìn giây.</p></li>
  <li><p><strong>Tính toàn vẹn dữ liệu:</strong> Toàn bộ thông tin phân bổ phân hệ và cơ sở được lưu trữ tập trung tại cơ sở dữ liệu dùng chung, bảo đảm tính nhất quán tức thì trên cả hai cổng đăng nhập.</p></li>
  <li><p><strong>Bảo mật phiên làm việc:</strong> Mỗi yêu cầu truy cập từ giao diện gửi lên máy chủ đều phải được kiểm tra cờ thẩm quyền phân hệ; từ chối và ghi nhật ký cảnh báo đối với mọi nỗ lực truy cập vượt quyền.</p></li>
</ul>

<hr/>

<h2>8. KẾT NỐI VÀ ĐẶC TẢ GIAO TIẾP HỆ THỐNG (SYSTEM INTEGRATION SPEC)</h2>
<ul>
  <li><p><strong>Kế thừa kiến trúc:</strong> Phân hệ Station và phân hệ Online sử dụng chung một cơ sở dữ liệu và chung máy chủ xác thực; không phát sinh cổng kết nối độc lập hay dịch vụ trung gian ngoài.</p></li>
  <li><p><strong>Gói dữ liệu cập nhật phân bổ (Cập nhật hồ sơ nhân sự):</strong></p>
    <ul>
      <li><p>Thực thể tiếp nhận: Cơ sở dữ liệu nhân sự (<code>hr_employees</code>).</p></li>
      <li><p>Dữ liệu gửi đi: Mã định danh nhân sự, cờ trạng thái phân hệ trực tuyến (<code>is_online</code>), danh sách mã cơ sở đào tạo (<code>station_branch_ids</code>).</p></li>
      <li><p>Dữ liệu phản hồi: Trạng thái thành công, thời gian cập nhật và phiên bản hồ sơ mới.</p></li>
    </ul>
  </li>
</ul>
`;

fs.writeFileSync('C:\\Users\\Jacky Tran\\.gemini\\antigravity\\brain\\d2571010-1e67-4762-891d-b31efd95b77d\\scratch\\confluence_storage.html', storageHtml.trim(), 'utf-8');
console.log('confluence_storage.html generated successfully.');
