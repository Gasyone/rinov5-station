/**
 * Kho dữ liệu Tiêu chuẩn vận hành 5 sao, Hình ảnh mẫu & Video mẫu
 * Dùng chung cho màn hình Thực thi đánh giá (Checklist) và Hộp thoại Danh mục đánh giá (Catalog)
 */

export interface DailyStandardMedia {
  title: string
  group: string
  requirement?: string
  standardDescription: string
  sampleAvatar: string
  samplePhotos: string[]
  sampleVideo?: string
  doList: string[]
  dontList: string[]
}

// 1. TIÊU CHUẨN MẪU CẤP DANH MỤC
export const CATEGORY_STANDARDS: Record<string, Omit<DailyStandardMedia, 'title'>> = {
  'KHU VỰC SẢNH NGOÀI': {
    group: 'KHU VỰC SẢNH NGOÀI',
    standardDescription:
      'Khu vực mặt tiền và lối tiếp cận cơ sở là bộ mặt thương hiệu 5 sao. Yêu cầu biển hiệu luôn sáng rõ 100% chữ, cửa kính sáng bóng không vết ố vân tay, thang máy và sảnh ngoài sạch sẽ, thông thoáng, không vật cản.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    doList: [
      'Bật đèn biển hiệu đúng giờ (trước 15 phút mở ca)',
      'Lau kính cửa chính sáng bóng, không còn vết vân tay hay bụi bẩn',
      'Sàn thang máy sạch sẽ, phím bấm hoạt động nhạy và không trầy xước',
      'Lối ra vào thông thoáng, không để xe hay vật cản lối đi',
    ],
    dontList: [
      'Để biển hiệu bị cháy bóng LED, mờ chữ hoặc bong tróc chữ decal',
      'Mặt kính bám bụi, nước mưa chưa gạt sạch hoặc tay nắm cửa lỏng lẻo',
      'Rác hoặc tàn thuốc vương vãi trước sảnh ra vào',
    ],
  },
  'SẢNH LỄ TÂN / HÀNH LANG': {
    group: 'SẢNH LỄ TÂN / HÀNH LANG',
    standardDescription:
      'Khu vực đón tiếp đầu tiên tạo cảm xúc chuyên nghiệp và thân thiện cho phụ huynh và học sinh. Tủ giày xếp thẳng tắp, thảm chân sạch phẳng, cây nước nóng lạnh luôn sẵn sàng phục vụ kèm nước thừa được đổ sạch.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1582653291997-079a1c04e5a1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    doList: [
      'Tủ giày gọn gàng, chia vị trí rõ ràng, không mùi hôi khó chịu',
      'Thảm chùi chân đặt ngay ngắn vuông vắn, được giặt sạch hàng ngày',
      'Cây nước luôn đầy đủ tối thiểu 1/2 bình 20L ở đầu ca, cốc giấy xếp sẵn',
      'Poster/Standee đặt đúng góc nhận diện, không cong mép',
      'Điều hòa bật 24-26°C tạo không khí thoáng mát dễ chịu',
    ],
    dontList: [
      'Giày dép vứt bừa bãi dưới sàn trước cửa',
      'Xô đựng nước thừa bị tràn hoặc bốc mùi',
      'Poster chương trình cũ đã hết hạn chưa được thay thế',
      'Điều hòa chảy nước xuống sàn gây trơn trượt',
    ],
  },
  'QUẦY LỄ TÂN': {
    group: 'QUẦY LỄ TÂN',
    standardDescription:
      'Trung tâm điều phối thông tin và tiếp đón khách hàng. Mặt quầy không để đồ cá nhân, tài liệu tư vấn và brochure sắp xếp theo khay mica tiêu chuẩn, mã QR check-in đặt vị trí thuận mắt phụ huynh.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    doList: [
      'Mặt quầy lễ tân thông thoáng, sạch sẽ, không có vết ố trà/cà phê',
      'Flyers/Salekit được xếp ngay ngắn, đủ số lượng cho ca trực',
      'Mã QR check-in đặt trang trọng ở chính giữa quầy',
      'Đèn rọi quầy lễ tân sáng đủ, ấm áp và chuyên nghiệp',
    ],
    dontList: [
      'Để đồ ăn, cốc nước dở hoặc túi xách cá nhân trên mặt quầy',
      'Tài liệu bừa bộn, quăn góc hoặc xếp lộn xộn',
      'Mã QR bị mờ, rách hoặc đặt khuất tầm nhìn phụ huynh',
    ],
  },
  'KHU VỰC IPAD': {
    group: 'KHU VỰC IPAD',
    standardDescription:
      'Khu vực trải nghiệm số và học tập tương tác. Thiết bị iPad luôn sạch bóng, màn hình hiển thị ứng dụng học tập quy chuẩn, tai nghe cuốn gọn và dây sạc luồn an toàn.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1510519138111-577d3542f95c?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    doList: [
      'Tất cả iPad được sạc pin trên 80% trước mỗi ca học',
      'Màn hình lau sạch dấu vân tay bằng khăn cồn chuyên dụng',
      'Tai nghe và dây sạc đặt gọn gàng, cố định an toàn',
    ],
    dontList: [
      'Để iPad hết pin hoặc sập nguồn trong giờ tiếp đón',
      'Màn hình bám mồ hôi, dầu nhớt hoặc nứt vỡ không báo cáo',
    ],
  },
  'KHU VỰC TỦ QUÀ': {
    group: 'KHU VỰC TỦ QUÀ',
    standardDescription:
      'Tủ quà tặng vinh danh học sinh và khuyến khích học tập. Quà tặng xếp theo phân loại, dán nhãn sao đổi quà rõ ràng, kính tủ quà lau trong suốt và có đèn led hắt sáng.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Quà tặng xếp ngay ngắn, bảng điểm đổi quà rõ ràng',
      'Cánh kính tủ quà lau sáng bóng, đóng kín tránh bụi',
    ],
    dontList: [
      'Để quà bụi bặm hoặc hộp rách nát trong tủ trưng bày',
    ],
  },
  'PHÒNG HỌC': {
    group: 'PHÒNG HỌC',
    standardDescription:
      'Không gian lớp học tiêu chuẩn 5 sao. Bàn ghế xếp ngay ngắn, bảng viết trắng tinh không còn mực cũ, máy chiếu / màn hình TV hoạt động sắc nét, máy lạnh mát lạnh và không có rác trong ngăn bàn.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    doList: [
      'Bàn ghế thẳng hàng theo layout chuẩn của trung tâm',
      'Bảng lau sạch trước ca, bút lông viết bảng đủ mực',
      'Máy chiếu/TV hoạt động tốt, âm thanh rõ ràng',
    ],
    dontList: [
      'Để rác, vỏ kẹo hoặc giấy nháp trong ngăn bàn',
      'Bàn ghế bị vẽ bậy mà chưa được lau chùi xử lý',
    ],
  },
  'KHU VỰC NHÀ VỆ SINH': {
    group: 'KHU VỰC NHÀ VỆ SINH',
    standardDescription:
      'Tiêu chuẩn vệ sinh khách sạn 5 sao. Sàn nhà khô ráo tuyệt đối, bồn rửa sạch không đọng nước, giấy vệ sinh và nước rửa tay luôn đầy đủ, tinh dầu thơm thoang thoảng.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Sàn khô ráo, có biển cảnh báo nếu vừa lau sàn',
      'Xà phòng rửa tay và giấy lau tay luôn sẵn sàng',
      'Thùng rác có nắp đậy và túi rác sạch sẽ',
    ],
    dontList: [
      'Sàn ướt trơn trượt gây nguy hiểm cho học sinh nhỏ tuổi',
      'Bốc mùi hôi hoặc hết xà phòng rửa tay',
    ],
  },
  'KIỂM TRA CƠ SỞ VẬT CHẤT': {
    group: 'KIỂM TRA CƠ SỞ VẬT CHẤT',
    standardDescription:
      'Nhiệm vụ chốt ca tối: Rà soát toàn bộ bàn ghế, thiết bị phòng học, khóa các tủ hồ sơ quan trọng và chuẩn bị không gian sẵn sàng cho ca sáng ngày hôm sau.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Kiểm tra ngăn bàn từng phòng học để thu gom rác hoặc đồ bỏ quên',
      'Xếp lại toàn bộ ghế vào gầm bàn ngay ngắn',
    ],
    dontList: [
      'Để quên tài liệu bảo mật của trung tâm trên bàn làm việc',
    ],
  },
  'HỆ THỐNG ĐIỆN VÀ AN TOÀN': {
    group: 'HỆ THỐNG ĐIỆN VÀ AN TOÀN',
    standardDescription:
      'Quy chuẩn phòng cháy chữa cháy và an toàn năng lượng. Tắt toàn bộ điều hòa, bình nóng lạnh, máy tính và đèn chiếu sáng không cần thiết trước khi rời cơ sở.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Tắt công tắc aptomat các line điều hòa và thiết bị nhiệt',
      'Kiểm tra bình cứu hỏa ở vị trí chuẩn, kim đo áp suất ở vạch xanh',
    ],
    dontList: [
      'Cắm sạc thiết bị qua đêm không có người giám sát',
      'Bỏ quên điều hòa hoặc máy tính hoạt động sau khi đóng cửa',
    ],
  },
  'BÀN GIAO VÀ KHÓA CỬA': {
    group: 'BÀN GIAO VÀ KHÓA CỬA',
    standardDescription:
      'Khóa tất cả các lớp cửa ra vào, bật hệ thống camera và báo động chống trộm, bàn giao chìa khóa cho bộ phận bảo vệ tòa nhà theo biên bản.',
    sampleAvatar:
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Kiểm tra khóa cửa kính và khóa cửa cuốn chắc chắn',
      'Bật công tắc camera an ninh và báo động hồng ngoại',
    ],
    dontList: [
      'Khóa cửa lỏng lẻo hoặc quên chốt khóa phụ',
    ],
  },
}

// 2. MAPPING TIÊU CHUẨN CHI TIẾT TỪNG TIÊU CHÍ (CRITERION LEVEL)
const ITEM_STANDARDS_MAP: Record<string, Partial<DailyStandardMedia>> = {
  'Biển hiệu quảng cáo': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    doList: [
      'Bật đèn LED biển hiệu trước 7h00 sáng và 17h30 chiều',
      'Kiểm tra đầy đủ từng nét chữ, không bị đứt đoạn ánh sáng',
      'Mặt mica biển sáng bóng, không bám mạng nhện hay bụi bẩn',
    ],
    dontList: [
      'Cháy bóng LED khiến chữ bị mất nét hoặc chập chờn',
      'Decal logo bị bong rách hoặc phai màu do mưa nắng',
    ],
  },
  'Thang máy': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Sàn thang máy sạch bóng, được hút bụi và lau thơm',
      'Mặt gương thang máy sáng bóng, không có vệt tay',
      'Bảng điều khiển và màn hình tầng hoạt động chính xác',
    ],
    dontList: [
      'Rác hoặc bùn đất đọng ở rãnh trượt cửa thang máy',
      'Nút bấm thang máy bị liệt hoặc chập chờn',
    ],
  },
  'Cửa chính': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Kính cường lực cửa chính trong suốt, không trầy xước',
      'Tay nắm cửa chắc chắn, được sát khuẩn hàng ngày',
      'Khóa và bản lề thủy lực đóng mở êm ái, không phát ra tiếng cọt kẹt',
    ],
    dontList: [
      'Kính nứt mẻ hoặc có dấu hiệu lỏng ốc bản lề',
      'Dán băng keo nham nhở hoặc vết keo cũ chưa tẩy',
    ],
  },
  'Tủ giày (số tủ giày, vị trí để giày)': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Giày dép xếp ngay ngắn theo từng ngăn số',
      'Dép đi trong nhà được khử khuẩn và xếp thẳng hàng',
      'Đặt sáp thơm hoặc túi hút ẩm trong các ngăn kín',
    ],
    dontList: [
      'Giày dép vứt ngổn ngang dưới sàn gây cản trở',
      'Tủ giày bốc mùi hoặc bám bụi dày',
    ],
  },
  'Thảm chân': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Thảm đặt vuông vắn ngay trước cửa chính và cửa vệ sinh',
      'Thảm khô ráo, màu sắc tươi mới, không quăn mép',
    ],
    dontList: [
      'Thảm ẩm ướt, nhớp nháp hoặc bốc mùi ẩm mốc',
    ],
  },
  'Khu vực nước uống (giá đựng cốc, cây nước, xô để nước thừa)': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    doList: [
      'Bình nước 20L luôn còn trên 1/2 bình ở đầu ca',
      'Giá đựng cốc xếp đầy cốc giấy sạch dùng một lần',
      'Xô nước thừa được đổ sạch và lau khô khay hứng nước',
    ],
    dontList: [
      'Cây nước hết nước hoặc vòi nóng lạnh không hoạt động',
      'Khay hứng nước thừa tràn lênh láng ra sàn nhà',
    ],
  },
  'Poster/banner': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Standee đứng thẳng, căng phẳng, không rách mép',
      'Nội dung poster đúng chương trình khuyến mãi và sự kiện tháng này',
    ],
    dontList: [
      'Standee bị nghiêng đổ hoặc đặt chắn lối thoát hiểm',
    ],
  },
  'Hình ảnh thực tế': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    doList: [
      'TV sảnh phát đúng video clip giới thiệu khóa học độ phân giải cao',
      'Loa mở nhạc nhẹ nền du dương (âm lượng 30-40 dB)',
    ],
    dontList: [
      'TV bị tắt, hiển thị màn hình chờ “No Signal” hoặc mất kết nối mạng',
      'Âm thanh loa quá to gây ồn ào ảnh hưởng tới các lớp học',
    ],
  },
  'Đèn quầy lễ tân': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Hệ thống đèn rọi quầy sáng đủ, ánh sáng vàng ấm 3000K',
      'Không có bóng đèn nào bị nhấp nháy',
    ],
    dontList: [
      'Cháy bóng đèn làm tối khuôn mặt nhân viên tiếp đón',
    ],
  },
  'Điều hòa khu vực chung': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    doList: [
      'Cài đặt nhiệt độ 24°C - 26°C, hướng gió đảo đều',
      'Lưới lọc bụi được vệ sinh định kỳ hàng tuần',
      'Ống thoát nước hoạt động tốt, không đọng giọt',
    ],
    dontList: [
      'Dàn lạnh rò rỉ nước chảy xuống sàn (Sự cố nghiêm trọng)',
      'Điều hòa phả ra mùi hôi ẩm mốc hoặc tiếng ồn lạ',
    ],
  },
  'Khu làm việc và phía sau quầy': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Bàn làm việc gọn gàng, tài liệu để vào hộc tủ có khóa',
      'Dây điện máy tính được bó gọn bằng dây xoắn ruột gà',
    ],
    dontList: [
      'Để đồ ăn vặt, áo khoác hoặc mũ bảo hiểm trên ghế làm việc',
    ],
  },
  'Flyers tư vấn/Salekit đầy đủ': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=900&q=80',
    ],
    doList: [
      'Salekit các chương trình học xếp đầy đủ theo thứ tự',
      'Tập gấp brochure phẳng phiu, không bị quăn góc hay nhàu nát',
    ],
    dontList: [
      'Hết tài liệu giới thiệu khóa học khi phụ huynh đến tư vấn',
    ],
  },
  'Mã QR check-in online hiển thị rõ tại quầy': {
    sampleAvatar:
      'https://images.unsplash.com/photo-1595079672139-bf89be824976?auto=format&fit=crop&w=300&q=80',
    samplePhotos: [
      'https://images.unsplash.com/photo-1595079672139-bf89be824976?auto=format&fit=crop&w=900&q=80',
    ],
    sampleVideo:
      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    doList: [
      'Biển mã QR để trong khung mica đặt chính giữa quầy',
      'Camera điện thoại quét nhận diện ngay lập tức dưới 1 giây',
    ],
    dontList: [
      'Mã QR bị che khuất bởi tài liệu khác hoặc bị mờ',
    ],
  },
}

// 2.5. BỘ LƯU TRỮ TIÊU CHUẨN ĐỘNG (KHI NGƯỜI DÙNG THÊM HOẶC SỬA TIÊU CHUẨN, ẢNH, VIDEO TRÊN GIAO DIỆN)
const DYNAMIC_ITEM_STANDARDS: Record<string, Partial<DailyStandardMedia>> = {}
const DYNAMIC_CATEGORY_STANDARDS: Record<string, Partial<DailyStandardMedia>> = {}

export function setCustomItemStandard(
  itemName: string,
  media: Partial<DailyStandardMedia>
) {
  DYNAMIC_ITEM_STANDARDS[itemName] = {
    ...(DYNAMIC_ITEM_STANDARDS[itemName] || {}),
    ...media,
  }
}

export function setCustomCategoryStandard(
  groupName: string,
  media: Partial<DailyStandardMedia>
) {
  DYNAMIC_CATEGORY_STANDARDS[groupName] = {
    ...(DYNAMIC_CATEGORY_STANDARDS[groupName] || {}),
    ...media,
  }
}

export function getCustomItemStandard(itemName: string): Partial<DailyStandardMedia> | undefined {
  return DYNAMIC_ITEM_STANDARDS[itemName] || ITEM_STANDARDS_MAP[itemName]
}

export function getCustomCategoryStandard(groupName: string): Partial<DailyStandardMedia> | undefined {
  const custom = DYNAMIC_CATEGORY_STANDARDS[groupName]
  const def = CATEGORY_STANDARDS[groupName]
  if (custom && def) return { ...def, ...custom }
  return custom || def
}

// 3. FALLBACK GENERATOR CHO MỌI TIÊU CHÍ VÀ DANH MỤC
export function getStandardForTarget(target: {
  type: 'category' | 'item'
  group: string
  name?: string
  requirement?: string
}): DailyStandardMedia {
  if (target.type === 'category') {
    const custom = DYNAMIC_CATEGORY_STANDARDS[target.group]
    const def = CATEGORY_STANDARDS[target.group]
    const cat = custom && def ? { ...def, ...custom } : custom || def

    if (cat) {
      return {
        title: target.group,
        group: target.group,
        requirement: cat.requirement || 'Tiêu chuẩn vận hành 5 sao cấp Danh mục',
        standardDescription: cat.standardDescription || '',
        sampleAvatar: cat.sampleAvatar || 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
        samplePhotos: cat.samplePhotos && cat.samplePhotos.length > 0 ? cat.samplePhotos : ['https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80'],
        sampleVideo: cat.sampleVideo,
        doList: cat.doList || [],
        dontList: cat.dontList || [],
      }
    }

    return {
      title: target.group,
      group: target.group,
      requirement: 'Tiêu chuẩn vận hành 5 sao toàn khu vực',
      standardDescription: `Toàn bộ các tiêu chí trong khu vực "${target.group}" phải đảm bảo tính sạch sẽ, ngăn nắp, an toàn và đồng bộ nhận diện thương hiệu chuẩn 5 sao.`,
      sampleAvatar:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
      samplePhotos: [
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
      ],
      sampleVideo:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      doList: [
        'Kiểm tra định kỳ đầu ca và cuối ca làm việc',
        'Báo cáo ngay trên hệ thống nếu phát hiện sự cố cơ sở vật chất',
      ],
      dontList: [
        'Bỏ qua tiêu chí mà không có lý do được Quản lý phê duyệt',
      ],
    }
  }

  // Tiêu chí cụ thể (item)
  const itemName = target.name || 'Tiêu chuẩn kiểm tra'
  const custom = DYNAMIC_ITEM_STANDARDS[itemName]
  const baseSpecific = ITEM_STANDARDS_MAP[itemName]
  const specific = custom && baseSpecific ? { ...baseSpecific, ...custom } : custom || baseSpecific

  const catCustom = DYNAMIC_CATEGORY_STANDARDS[target.group]
  const catBase = CATEGORY_STANDARDS[target.group]
  const cat = catCustom && catBase ? { ...catBase, ...catCustom } : catCustom || catBase

  if (specific) {
    return {
      title: itemName,
      group: target.group,
      requirement: target.requirement || specific.requirement || 'Theo quy chuẩn vận hành 5 sao.',
      standardDescription:
        specific.standardDescription ||
        `Tiêu chuẩn chi tiết cho "${itemName}" tại ${target.group}. Đảm bảo các chỉ số thẩm mỹ, an toàn và tiện ích tối đa cho học viên và phụ huynh.`,
      sampleAvatar:
        specific.sampleAvatar ||
        cat?.sampleAvatar ||
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80',
      samplePhotos:
        specific.samplePhotos && specific.samplePhotos.length > 0
          ? specific.samplePhotos
          : cat?.samplePhotos || [
              'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
            ],
      sampleVideo: specific.sampleVideo || cat?.sampleVideo,
      doList: specific.doList && specific.doList.length > 0 ? specific.doList : (cat?.doList || [
        'Thực hiện kiểm tra trực quan và thử nghiệm chức năng',
        'Chụp ảnh minh chứng rõ nét nếu phát hiện lỗi',
      ]),
      dontList: specific.dontList && specific.dontList.length > 0 ? specific.dontList : (cat?.dontList || [
        'Tự ý bỏ qua kiểm tra',
        'Đánh dấu Đạt khi thiết bị chưa hoạt động ổn định',
      ]),
    }
  }

  // Fallback thông minh dựa trên nhóm danh mục
  return {
    title: itemName,
    group: target.group,
    requirement: target.requirement || 'Theo quy chuẩn vận hành 5 sao của cơ sở.',
    standardDescription: `Quy chuẩn đánh giá chất lượng cho "${itemName}". Yêu cầu duy trì trạng thái hoạt động tốt nhất, sạch sẽ, thẩm mỹ và an toàn tuyệt đối.`,
    sampleAvatar:
      cat?.sampleAvatar ||
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=300&q=80',
    samplePhotos:
      cat?.samplePhotos && cat.samplePhotos.length > 0
        ? cat.samplePhotos
        : [
            'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=900&q=80',
          ],
    sampleVideo: cat?.sampleVideo,
    doList: cat?.doList || [
      'Kiểm tra độ sạch sẽ, vận hành ổn định',
      'Đảm bảo ngăn nắp, đúng vị trí quy định',
    ],
    dontList: cat?.dontList || [
      'Để tồn tại bụi bẩn hoặc hư hỏng không khắc phục',
    ],
  }
}

// 4. LẤY AVATAR NHANH CHO TỪNG DÒNG TIÊU CHÍ (HIỂN THỊ Ở ĐẦU DÒNG)
export function getItemAvatarInfo(itemName: string, groupName: string): {
  avatar: string
  hasVideo: boolean
} {
  const custom = DYNAMIC_ITEM_STANDARDS[itemName]
  const baseSpecific = ITEM_STANDARDS_MAP[itemName]
  const specific = custom && baseSpecific ? { ...baseSpecific, ...custom } : custom || baseSpecific

  const catCustom = DYNAMIC_CATEGORY_STANDARDS[groupName]
  const catBase = CATEGORY_STANDARDS[groupName]
  const cat = catCustom && catBase ? { ...catBase, ...catCustom } : catCustom || catBase

  const avatar =
    specific?.sampleAvatar ||
    cat?.sampleAvatar ||
    'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=300&q=80'

  const hasVideo = Boolean(specific?.sampleVideo || cat?.sampleVideo)

  return { avatar, hasVideo }
}
