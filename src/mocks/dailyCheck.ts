/**
 * Mock Data for Daily Checklist & Standard Catalog
 * Sourced directly from: 'RINO OFFLINE - QC CHẤT LƯỢNG DỊCH VỤ' (Google Sheets)
 * Group 1: Daily check list và danh mục
 */

export type DailyCheckShift = 'dau_ca' | 'cuoi_ca'
export type DailyCheckStatus = 'on_time' | 'late' | 'missing'
export type DailyItemEvaluation = 'pass' | 'fail'
export type DailyClosingTaskStatus = 'done' | 'not_done'

export interface DailyAreaResult {
  key: string
  name: string
  status: DailyItemEvaluation
  photos: string[]
  note?: string
}

export interface DailyClosingResult {
  id: string
  name: string
  status: DailyClosingTaskStatus
  note?: string
}

export interface DailyCheckSubmission {
  id: string
  timestamp: string
  date: string
  branch: string
  staffName: string
  shift: DailyCheckShift
  status: DailyCheckStatus
  daytimeItems: DailyAreaResult[]
  closingItems: DailyClosingResult[]
  passRate: number
  failedItemsCount: number
  escalatedToQc?: boolean
  qcIncidentCode?: string | null
}

export interface DailyCatalogItem {
  stt: string
  group: string
  detail: string
  requirement: string
}


export interface DailyCatalogVersion {
  version: string
  effectiveDate: string
  expiryDate?: string
  status: 'active' | 'archived' | 'draft'
  approvedBy: string
  approvedRole: string
  itemCount: number
  summary: string
  changelog: string[]
}

export interface DailyCatalogProposal {
  id: string
  proposedBy: string
  proposedRole: string
  branch: string
  proposedDate: string
  category: string
  itemTitle: string
  requirement: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  reviewerNote?: string
}

export interface DailyClosingTask {
  id: string
  group: string
  name: string
  description: string
}

export const DAILY_SHIFT_LABELS: Record<DailyCheckShift, string> = {
  dau_ca: 'Đầu ca (Mở cửa/Sáng)',
  cuoi_ca: 'Cuối ca (Đóng cửa/Tối)',
}

export const DAILY_STATUS_LABELS: Record<DailyCheckStatus, string> = {
  on_time: 'Đúng hạn',
  late: 'Nộp muộn',
  missing: 'Chưa nộp',
}

export const DAILY_BRANCH_OPTIONS = [
  'CS1 Linh Đàm',
  'CS3 Vin SA1',
  'CS5 47 Nguyễn Tuân',
  'CS6 Tonkin',
  'CS7 170 Nguyễn Tuân',
  'CS8 Mỹ Đình',
  'CS9 Cầu Giấy',
  'CS10 Hà Đông',
  'CS11 Long Biên',
  'CS12 Hai Bà Trưng',
  'CS14 Đống Đa',
  'CS15 Ba Đình',
  'CS16 Tây Hồ',
  'CS18 Times City',
  'CS20 Royal City',
  'CS22 Ocean Park 1',
  'CS23 Ocean Park 2',
  'CS25 Smart City',
  'CS26 Ecopark',
  'CS28 Star Lake',
  'CS30 Ngoại Giao Đoàn',
]

export const DAILY_CATALOG_ITEMS: DailyCatalogItem[] = [
  {
    "stt": "1",
    "group": "KHU VỰC SẢNH NGOÀI",
    "detail": "Biển hiệu quảng cáo",
    "requirement": "Đèn sáng, đủ chữ, không bong tróc, bạc màu"
  },
  {
    "stt": "1",
    "group": "KHU VỰC SẢNH NGOÀI",
    "detail": "Thang máy",
    "requirement": "Sạch sẽ, ổn định, đèn sáng"
  },
  {
    "stt": "1",
    "group": "KHU VỰC SẢNH NGOÀI",
    "detail": "Cửa chính",
    "requirement": "Chắc chắn, sạch sẽ, không nứt vỡ"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Tủ giày (số tủ giày, vị trí để giày)",
    "requirement": "Gọn gàng, ngay ngắn, sạch sẽ, không mùi"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Thảm chân",
    "requirement": "Ngay ngắn, sạch sẽ"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Khu vực nước uống (giá đựng cốc, cây nước, xô để nước thừa)",
    "requirement": "Sạch sẽ, gọn gàng, hợp vệ sinh, đầy đủ để tiếp khách (còn tối thiểu 1/2 bình 20 lít ở đầu ca)"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Poster/banner",
    "requirement": "Poster chương trình, standee, banner được trưng bày ngay ngắn"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Hình ảnh thực tế",
    "requirement": "Có TV và loa kéo mở nhạc và hình ảnh"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Đèn quầy lễ tân",
    "requirement": "Chất lượng ánh sáng tốt, ổn định, đầy đủ"
  },
  {
    "stt": "2",
    "group": "SẢNH LỄ TÂN / HÀNH LANG",
    "detail": "Điều hòa khu vực chung",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Khu làm việc và phía sau quầy",
    "requirement": "Gọn gàng, sạch đẹp, ngay ngắn, đúng chuẩn"
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Flyers tư vấn/Salekit đầy đủ",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Mã QR check-in online hiển thị rõ tại quầy",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Bảng học phí (phiên bản mới nhất, có dấu trung tâm) đặt tại quầy",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Tập hồ sơ mẫu (Phiếu thu học phí, Đơn nhập học, Đơn bảo lưu...) sẵn sàng",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Máy tính/laptop tại quầy truy cập được CRM và form đăng ký",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "iPad hoặc thiết bị test nhanh được sạc đầy pin",
    "requirement": ""
  },
  {
    "stt": "3",
    "group": "QUẦY LỄ TÂN",
    "detail": "Máy in hoạt động bình thường, có giấy và mực dự phòng",
    "requirement": ""
  },
  {
    "stt": "4",
    "group": "KHU VỰC IPAD",
    "detail": "Bàn / ghế",
    "requirement": "Ngăn nắp, gọn gàng, sạch sẽ, thuận tiện sử dụng, đạt tiêu chuẩn 5*****\nBày ipad ngay ngắn ngay đầu ca làm việc"
  },
  {
    "stt": "4",
    "group": "KHU VỰC IPAD",
    "detail": "Sạc pin đầy đủ (Phân loại ipad rõ ràng)",
    "requirement": ""
  },
  {
    "stt": "6",
    "group": "KHU VỰC TỦ QUÀ",
    "detail": "Quà trưng bày thương hiệu (Ba lô, áo, hộp bút vải)",
    "requirement": "Sắp xếp ngay ngắn, phân loại rõ ràng theo từng khu vực. Bắt buộc quay mặt có logo RinoEdu ra ngoài hướng về phía khách hàng."
  },
  {
    "stt": "6",
    "group": "KHU VỰC TỦ QUÀ",
    "detail": "Quà cho học sinh đổi cups",
    "requirement": "Xếp gọn gàng, đa dạng chủng loại quà tặng. Không để trống các ô kệ trưng bày."
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Cửa ra vào",
    "requirement": "Sạch sẽ, chắc chắn"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Bảng",
    "requirement": "Sạch sẽ, ngăn nắp, gọn gàng"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Đèn phòng học",
    "requirement": "Chất lượng ánh sáng tốt, ổn định, đầy đủ"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Bàn giáo viên",
    "requirement": "Ngăn nắp, sạch sẽ"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Bàn ghế học sinh",
    "requirement": "Gọn gàng, sạch đẹp, không cập kênh"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Tivi",
    "requirement": "Sạch sẽ, hoạt động ổn định"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Rèm cửa",
    "requirement": "Kéo rèm lên vào đầu ngày\nHạ xuống vào cuối ngày\nSạch sẽ, ổn định"
  },
  {
    "stt": "5",
    "group": "PHÒNG HỌC",
    "detail": "Điều hòa phòng học",
    "requirement": ""
  },
  {
    "stt": "7",
    "group": "KHU VỰC NHÀ VỆ SINH",
    "detail": "Trang thiết bị phòng vệ sinh (Bồn rửa tay, Bồn cầu, Thùng rác, Dép nhà vệ sinh, Khăn lau, Nước rửa tay, hệ thống đèn và quạt thông gió)",
    "requirement": "Đầy đủ, ngăn nắp, gọn gàng, hợp vệ sinh, hoạt động tốt, không rò rỉ nước, tắc nước,"
  },
  {
    "stt": "7",
    "group": "KHU VỰC NHÀ VỆ SINH",
    "detail": "Sàn nhà vệ sinh",
    "requirement": "Sạch sẽ, khô ráo, không trơn trượt"
  },
  {
    "stt": "8",
    "group": "CƠ SỞ HẠ TẦNG TRUNG TÂM",
    "detail": "Tường",
    "requirement": "Không bong tróc, không vết bẩn"
  },
  {
    "stt": "8",
    "group": "CƠ SỞ HẠ TẦNG TRUNG TÂM",
    "detail": "Trần nhà",
    "requirement": "Không bong tróc, không vết bẩn, không nứt vỡ, \nkhông màng nhện"
  },
  {
    "stt": "8",
    "group": "CƠ SỞ HẠ TẦNG TRUNG TÂM",
    "detail": "Sàn nhà (các khu vực còn lại ngoài nhà vệ sinh)",
    "requirement": "Sạch sẽ, khô thoáng, không trơn trượt"
  },
  {
    "stt": "9",
    "group": "TÁC PHONG NHÂN SỰ",
    "detail": "Trang phục theo quy định bao gồm: \n- Sale/CS: mặc đồng phục gọn gàng, đeo bảng tên\n- GV: Mặc trang phục lịch sự, phù hợp với công việc giảng dạy, đeo bảng tên",
    "requirement": ""
  }
]

export const DAILY_CLOSING_TASKS: DailyClosingTask[] = [
  {
    id: "closing_ac_tv",
    group: "THIẾT BỊ ĐIỆN & ĐIỀU HÒA",
    name: "Điều hòa & Tivi",
    description: "Tắt toàn bộ điều hòa, Tivi tại tất cả các phòng học, sảnh chung và phòng làm việc."
  },
  {
    id: "closing_tv_devices",
    group: "THIẾT BỊ ĐIỆN & ĐIỀU HÒA",
    name: "Tivi & Thiết bị phòng học",
    description: "Tắt nguồn Tivi, máy tính tại các phòng học, phòng làm việc."
  },
  {
    id: "closing_pc_printer",
    group: "THIẾT BỊ ĐIỆN & ĐIỀU HÒA",
    name: "Máy tính & Máy in",
    description: "Tắt nguồn máy tính/laptop tại quầy lễ tân."
  },
  {
    id: "closing_ipad",
    group: "THIẾT BỊ HỌC TẬP & IPAD",
    name: "Hệ thống iPad",
    description: "Gom đủ số lượng iPad học sinh về tủ/kệ sạc, cắm sạc đầy pin chuẩn bị cho ngày mai."
  },
  {
    id: "closing_trash",
    group: "VỆ SINH & BÀN GHẾ PHÒNG HỌC",
    name: "Thu gom rác mặt bằng",
    description: "Thu gom sạch rác, cốc nước thừa, vỏ bánh kẹo trên mặt bàn, mặt quầy và sàn nhà bỏ gọn vào thùng rác."
  },
  {
    id: "closing_furniture",
    group: "VỆ SINH & BÀN GHẾ PHÒNG HỌC",
    name: "Sắp xếp bàn ghế",
    description: "Kê lại bàn ghế ngay ngắn, thẳng hàng trong các phòng học. Mặt bàn sạch sẽ, không để lại sách vở."
  },
  {
    id: "closing_gift_shelf",
    group: "KHU VỰC CHỜ & TỦ QUÀ",
    name: "Sắp xếp tủ quà",
    description: "Xếp ngay ngắn lại các ô quà bị xô lệch sau ca học. Gom gọn đồ trong kho tủ quà."
  },
  {
    id: "closing_play_area",
    group: "KHU VỰC CHỜ & TỦ QUÀ",
    name: "Khu đồ chơi / Khu chờ",
    description: "Thu dọn toàn bộ đồ chơi của học sinh xếp gọn vào tủ/hộp đựng quy định."
  },
  {
    id: "closing_security",
    group: "AN NINH & KHÓA CỬA AN TOÀN",
    name: "Khóa cửa an toàn",
    description: "Kiểm tra và khóa chặt tất cả cửa sổ phòng học. Khóa cửa kính chính và hạ cửa cuốn trung tâm (nếu có)."
  }
]


export const MOCK_CATALOG_VERSIONS: DailyCatalogVersion[] = [
  {
    version: 'v2.1',
    effectiveDate: '01/06/2026',
    status: 'active',
    approvedBy: 'Trần Văn Kiên',
    approvedRole: 'Giám đốc Vận hành & QC',
    itemCount: 45,
    summary: 'Chuẩn hóa 9 khu vực ban ngày và 9 nhiệm vụ chốt ca đêm; bổ sung tiêu chuẩn QR check-in và sạc pin iPad 5 sao.',
    changelog: [
      'Bổ sung tiêu chuẩn QR check-in online tại quầy lễ tân',
      'Yêu cầu 100% iPad học sinh gom sạc đầy pin trước khi ra về',
      'Siết chặt quy định đồng phục và thẻ tên nhân sự trực ca',
      'Bổ sung cơ chế bắt buộc đính kèm ảnh minh chứng theo từng khu vực',
    ],
  },
  {
    version: 'v2.0',
    effectiveDate: '01/01/2026',
    expiryDate: '31/05/2026',
    status: 'archived',
    approvedBy: 'Lê Thị Hạnh',
    approvedRole: 'Trưởng phòng Đảm bảo Chất lượng',
    itemCount: 40,
    summary: 'Cập nhật tiêu chuẩn cơ sở vật chất theo bộ nhận diện thương hiệu RinoEdu mới trên toàn quốc.',
    changelog: [
      'Chuẩn hóa khu vực tủ quà thương hiệu: bắt buộc quay mặt logo ra ngoài',
      'Quy định tiêu chuẩn đèn chiếu sáng và âm thanh tại sảnh lễ tân',
      'Định kỳ kiểm tra rèm cửa phòng học đầu ca và cuối ca',
    ],
  },
  {
    version: 'v1.0',
    effectiveDate: '15/06/2025',
    expiryDate: '31/12/2025',
    status: 'archived',
    approvedBy: 'Ban Giám Đốc RinoEdu',
    approvedRole: 'Hội đồng Quản trị',
    itemCount: 30,
    summary: 'Phiên bản biểu mẫu kiểm tra cơ sở đầu tiên triển khai qua Google Form offline.',
    changelog: [
      'Khởi tạo 7 khu vực kiểm tra cơ sở vật chất cơ bản',
      'Ghi nhận phản hồi thủ công theo ngày',
    ],
  },
]

export const MOCK_CATALOG_PROPOSALS: DailyCatalogProposal[] = [
  {
    id: 'prop_01',
    proposedBy: 'Nguyễn Thị Ngọc Ánh',
    proposedRole: 'Nhân viên Tiếp tân',
    branch: 'CS1 Linh Đàm',
    proposedDate: '26/10/2026',
    category: 'QUẦY LỄ TÂN',
    itemTitle: 'Bổ sung máy xịt khuẩn và đo thân nhiệt tự động',
    requirement: 'Máy luôn đầy dung dịch sát khuẩn, pin hoạt động tốt, đặt ngay lối vào bên cạnh quầy.',
    reason: 'Thời tiết giao mùa nhiều học viên nhỏ tuổi dễ ốm, phụ huynh đánh giá rất cao trung tâm có trang bị chu đáo.',
    status: 'pending',
  },
  {
    id: 'prop_02',
    proposedBy: 'Bùi Duy Quang',
    proposedRole: 'Chuyên viên Chăm sóc Khách hàng',
    branch: 'CS6 Tonkin',
    proposedDate: '20/10/2026',
    category: 'PHÒNG HỌC',
    itemTitle: 'Kiểm tra máy hút ẩm / khử mùi trước giờ học',
    requirement: 'Bật máy hút ẩm 15 phút trước ca học nếu độ ẩm không khí vượt 80%.',
    reason: 'Đảm bảo phòng học khô thoáng, không bị ẩm mốc thảm chân vào những ngày thời tiết nồm ẩm.',
    status: 'approved',
    reviewerNote: 'Ý kiến rất thiết thực, đã tích hợp vào dự thảo quy chuẩn mùa đông 2026.',
  },
  {
    id: 'prop_03',
    proposedBy: 'Đỗ Bảo Ngọc',
    proposedRole: 'Quản lý Cơ sở',
    branch: 'CS7 170 Nguyễn Tuân',
    proposedDate: '15/10/2026',
    category: 'KHU VỰC IPAD',
    itemTitle: 'Bổ sung cáp sạc dự phòng Type-C và bút cảm ứng',
    requirement: 'Mỗi tủ sạc có tối thiểu 2 dây sạc Type-C dự phòng và 4 ngòi bút cảm ứng.',
    reason: 'Tránh việc iPad của học sinh bị hết pin giữa buổi test hoặc ca học trải nghiệm.',
    status: 'approved',
    reviewerNote: 'Phòng Hành chính đã cấp phát bổ sung cho tất cả cơ sở.',
  },
]

export const mockDailyCheckSubmissions: DailyCheckSubmission[] = [
{
    "id": "chk_1001",
    "timestamp": "2026-10-26 08:15:00",
    "date": "2026-10-26",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1002",
    "timestamp": "2026-10-26 21:35:00",
    "date": "2026-10-26",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1003",
    "timestamp": "2026-10-27 08:15:00",
    "date": "2026-10-27",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1004",
    "timestamp": "2026-10-27 21:35:00",
    "date": "2026-10-27",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1005",
    "timestamp": "2026-10-28 08:15:00",
    "date": "2026-10-28",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "fail",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 89,
    "failedItemsCount": 1,
    "escalatedToQc": true,
    "qcIncidentCode": "QC-OCT-1005"
  },
  {
    "id": "chk_1006",
    "timestamp": "2026-10-28 21:35:00",
    "date": "2026-10-28",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1007",
    "timestamp": "2026-10-29 08:15:00",
    "date": "2026-10-29",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1008",
    "timestamp": "2026-10-26 08:15:00",
    "date": "2026-10-26",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1009",
    "timestamp": "2026-10-26 21:35:00",
    "date": "2026-10-26",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1010",
    "timestamp": "2026-10-27 08:15:00",
    "date": "2026-10-27",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1011",
    "timestamp": "2026-10-27 21:35:00",
    "date": "2026-10-27",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1012",
    "timestamp": "2026-10-28 08:15:00",
    "date": "2026-10-28",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1013",
    "timestamp": "2026-10-28 21:35:00",
    "date": "2026-10-28",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1014",
    "timestamp": "2026-10-29 08:15:00",
    "date": "2026-10-29",
    "branch": "CS3 Vin SA1",
    "staffName": "Đỗ Thị Mai",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1015",
    "timestamp": "2026-10-26 08:15:00",
    "date": "2026-10-26",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1016",
    "timestamp": "2026-10-26 21:35:00",
    "date": "2026-10-26",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1017",
    "timestamp": "2026-10-27 08:15:00",
    "date": "2026-10-27",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1018",
    "timestamp": "2026-10-27 21:35:00",
    "date": "2026-10-27",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "not_done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 89,
    "failedItemsCount": 1,
    "escalatedToQc": true,
    "qcIncidentCode": "QC-OCT-1018"
  },
  {
    "id": "chk_1019",
    "timestamp": "2026-10-28 08:15:00",
    "date": "2026-10-28",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1020",
    "timestamp": "2026-10-28 21:35:00",
    "date": "2026-10-28",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1021",
    "timestamp": "2026-10-29 08:15:00",
    "date": "2026-10-29",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1022",
    "timestamp": "2026-10-26 08:15:00",
    "date": "2026-10-26",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1023",
    "timestamp": "2026-10-26 21:35:00",
    "date": "2026-10-26",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1024",
    "timestamp": "2026-10-27 08:15:00",
    "date": "2026-10-27",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "fail",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 89,
    "failedItemsCount": 1,
    "escalatedToQc": true,
    "qcIncidentCode": "QC-OCT-1024"
  },
  {
    "id": "chk_1025",
    "timestamp": "2026-10-27 21:35:00",
    "date": "2026-10-27",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1026",
    "timestamp": "2026-10-28 08:15:00",
    "date": "2026-10-28",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1027",
    "timestamp": "2026-10-28 21:35:00",
    "date": "2026-10-28",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1028",
    "timestamp": "2026-10-29 08:15:00",
    "date": "2026-10-29",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1029",
    "timestamp": "2026-10-26 08:15:00",
    "date": "2026-10-26",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1030",
    "timestamp": "2026-10-26 21:35:00",
    "date": "2026-10-26",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1031",
    "timestamp": "2026-10-27 08:15:00",
    "date": "2026-10-27",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1032",
    "timestamp": "2026-10-27 21:35:00",
    "date": "2026-10-27",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1033",
    "timestamp": "2026-10-28 08:15:00",
    "date": "2026-10-28",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1034",
    "timestamp": "2026-10-28 21:35:00",
    "date": "2026-10-28",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_1035",
    "timestamp": "2026-10-29 08:15:00",
    "date": "2026-10-29",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Trần Văn Kiên",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=sample_photo_proof_real"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0002",
    "timestamp": "6/12/2026 9:23:39",
    "date": "6/12/2026",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Nguyễn Thị Hương Thảo (test)",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1ReonkYTrTkANdNmZZ5fC8B4WoxWcDu4-"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1x2-j7Tfo6SjMR1LFe_fH-hOTbvVftAiG"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1TsAYP4zjSY8-cEnRkcowD_pooYTjLzLu"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1k-XsxjAThqyDKkOEC-uF6WEW52ciQJuU"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1QZtFmL_VJN1r_7gjwAeX0nmXTpGWgTNG",
          "https://drive.google.com/open?id=1fGFJnaGeZmy9AEVpEvUP1r4xJ6KkvOtv"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1DlIiILZ_gSHg9H3TDirDKauNyUufzKXl"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1C5fzk87JwOjD3gfdEceDN5fJA99wKgiN"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1K_EZyyp3PCTA-tlo8BX1zLYe6YK4rk4E"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1N_0F7NK61yHRKTWV8rpjS6MbVY-zrz-Z"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0004",
    "timestamp": "6/13/2026 14:16:23",
    "date": "6/13/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=18GevHYALn2sxoBESExIAKVyzLl893Vkp"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1GOFEpCENm9DIU34WPoOjYeRSo9IhUgTB"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1vCvX-Lbdg_-0TlqSVXsbeRxtfD03Dfdm"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1asprsCg9UJcf8uQVNX45GGWPjAMybs42"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1dRCBi1AGz8iZH9dO-8TBTW5T-18ktt44"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1wrvJtUtYMXBWUa1rzqWgnsisGW3u6ZgO",
          "https://drive.google.com/open?id=1j87-ihfqhFxluhX83Y0QH4klb-7A976b"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1Wy3lJyxnkQwWGolObw1QxVVlBkIWc4xO"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1Rt_xKnG_iGzEUtBCZjIVZYJxjrMv1egJ",
          "https://drive.google.com/open?id=1TxUm3m9uM6zTKBOCShTU36eZHmHojM4-"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=17QhXpanisbX430Gk75p88jFCTFVnuYiW",
          "https://drive.google.com/open?id=1yAaYK41HOjDCD5BLD_EL801MeJYLXiVY"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0006",
    "timestamp": "6/13/2026 14:21:23",
    "date": "6/13/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=16eEH5zIWte5MJmO-2kMmDATwBzYT2NBu"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1rfKMSAvIULS90ZJk7ftOPrZAT3_x8a-y",
          "https://drive.google.com/open?id=1gpKKeRPZJva6LVqaBT2W1QEXjcOGoERm"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=16esZnLVS32v4m56o-rLnObu0OMFi0veJ"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1f0SP51znbMRi5W4Jb7fZYiS58CqJ6ahu"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1uHzi7irXRWEmcrlkhV7GIzofGYIFki0O"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1ru46HQsRteTKGCQTJkZtzbMn9qCyxJGr",
          "https://drive.google.com/open?id=1EvRUzC_FVq-rE_QWfVqYUhUzHxMdCx8N"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1kf2Cac-H_9Mze6pzi8WNPjQbDqFbVH9H"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1C7Nol9qtkvT8CqL0oUSYj58Y7NPm3ibj",
          "https://drive.google.com/open?id=1mCbTY_WY9icWLMgd5sSr_Qogeqa2RcOt"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1CMlebGxKbKLPKTsEhFh3c_RseUx6vkNO",
          "https://drive.google.com/open?id=1ikev0FADARryl02QFTttosqW7spEHtEy"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0008",
    "timestamp": "6/13/2026 14:50:05",
    "date": "6/13/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1r7VAdgZQinrh1FX0wGR6M91o4-qg6HK8",
          "https://drive.google.com/open?id=1r4bgY0OEHeaDb6mCF2k6QIe5ASlYR9c4"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=130xbSQmBSlg-Dezg4OIPbNtDZaSyiLxx",
          "https://drive.google.com/open?id=1e42r0Xlnf5SCiKuadkUfFw3YLo-jgQRU",
          "https://drive.google.com/open?id=18PdB6OVUWacZKx301GZNUJA7ZuI6UcB9"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "fail",
        "photos": [
          "https://drive.google.com/open?id=12YvV7l3NABm0dkHxwO7Mi62gGqZ3wDbU"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1D6O6M_aVQxZQ8-k9ot18nAqDUdAyqM6X"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1lyQwFU1NP1zHxmaWrcn-oSy9cMVyrgAJ"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1sDmBtPiWbnOBhGulHuhuLOZtEY7TGIhC",
          "https://drive.google.com/open?id=1mLToDOkUHlqytPmDZOQfX8vfMis59tYZ",
          "https://drive.google.com/open?id=1YuK1SFWoUWtw8soJNXoajUzqoLgla85N"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1eaXLa2172xkEgunh1ARivTcDIQzTkFWX"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=11Upc52MX7i38yanyEzuN4ZgXwTxZBrix"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1ZiKqs30szO0Q3U8juHNAQ_4uObBgDpug"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 89,
    "failedItemsCount": 1,
    "escalatedToQc": true,
    "qcIncidentCode": "QC-INC-008"
  },
  {
    "id": "chk_0010",
    "timestamp": "6/13/2026 15:08:44",
    "date": "6/13/2026",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Trần Thị Kim Chi",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=17PZj_4HoNSmjpQ9JL1zYkINNMsOXuhC-"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=18I9dqQ-W909sR5DvWLOGYfCsgYPuMOQU"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1csQNuXxwSq8ALZNqPNrY-CC50Nd6Ze0A"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=19UL3Y-RnPwQAW5PpSHD3KBKAJ3PJnKam"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1deo32DGPKkJbw0qI0RGRDr1CkBzdvnJY"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=13fUJ5pVd7txxh3k0ySC1SA-RnIXaXTyW"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=10OLx858YdbE9EKu89WdN-Oqii2nZYqSX"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1NRlt0zYEknvmr0MMUGukuayD_S-kC6Vm"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "fail",
        "photos": [
          "https://drive.google.com/open?id=1WRHqyNQsqDhGYgJGM6xD24sz_GYOFPbr"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 89,
    "failedItemsCount": 1,
    "escalatedToQc": true,
    "qcIncidentCode": "QC-INC-010"
  },
  {
    "id": "chk_0012",
    "timestamp": "6/13/2026 15:46:37",
    "date": "6/13/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1GikwkxBTDN1B16d6hlIWC-aTttc2b288"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1Z0NRIrAPrPaeUHJDaMdroaXP-7BHaXhY"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1c8yZdBTIoXM2xqbtBj-kptUuERBHG2Xu"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1pwd-Ml3htaY-08kPOw_ECBo29seqwXB6"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1H81wOuxmmNIgopb9pRAEoT2Nht-uWkKz"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=12nRnK4Uf5emKXHrBGJJ2TktUEEm4N3Qi"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1TuNW7BGwqelJNXfHU4RQEJtd501v0ee0"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1UiOeOxHeZiomNZvmsLRsZNlf-do--wnc"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=17ap81j9YuP0F89GgEcfxhi-Z2IwZCKBH"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0014",
    "timestamp": "6/13/2026 16:53:47",
    "date": "6/13/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Đặng Thị Thơm",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1U8nv9ilHHisBtuwZ2pKENBqz0i4JLExz"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1EUF0bOrHofsmvzcj_Zs50c3gJtpWc7Eu",
          "https://drive.google.com/open?id=1rmK4AF382kYFTw0DtFWeEZP1kkS1EOHJ",
          "https://drive.google.com/open?id=1NEpIGdpaRwhy1iAljg0GUFbSArzBdJA8",
          "https://drive.google.com/open?id=1kmRzKHiEsbKpXKO6Uwaov9-rhH1Jg7RL",
          "https://drive.google.com/open?id=17rohcKium-YHkvRJVMCAVgamgR7uZ52b"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=11eE4uos0oF2XP3X80zPGNlhVLVUBI6V2"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1b-NwKO8-qAM0nfXNQNBPv0-8fA812DNE"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1FPMYaD0VQoKcWPEaY-rAQlc63L-ImKRw"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1dF6AwxzNHGWUSLq0yRSKZBoxcT5uZvOn"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=17tCqpGQK5CFmlveEzBEktdwp3Zarwwqk"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1AxT2EXJhqeaPuklkW6rLPQuX56pJS0WL"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=15p11HezeWq5XxkHAisNA1Yh1KqqkZGHX"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0016",
    "timestamp": "6/13/2026 20:57:59",
    "date": "6/13/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0018",
    "timestamp": "6/13/2026 21:32:33",
    "date": "6/13/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Phương Trang",
    "shift": "cuoi_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0020",
    "timestamp": "6/13/2026 23:00:19",
    "date": "6/13/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0022",
    "timestamp": "6/14/2026 13:58:30",
    "date": "6/14/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1o7dszF4is9HG2nwhVLXob4j8uVYk6mD7",
          "https://drive.google.com/open?id=1cLnzjNQc4HyJfcg_LFsT2RuF49pNt1EM"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1fKB1KYbEaMI445c2uniNU1-TuoxNxJH_",
          "https://drive.google.com/open?id=1aEBlEupjanNEyjI5bcfwGL-wSHzt8etv",
          "https://drive.google.com/open?id=1mAW2mW7jDFb8NLrYEXqCuQ_r4GaSxGR9"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1AmPklBIyNo_t1mXC0mjkDngX5x99zxko"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1bxY1SDz6psbVVkfSAM7fYG9xwExbIepm",
          "https://drive.google.com/open?id=1n87HI8vb7gSX_EIms-U2xZJXgcMNfeiz"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1iWi9AtXiAUgMAcyZzyM5a5VALrU89w7F"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1rDUu373ywwNmTbM_rPw8mtR07bxvXVGq",
          "https://drive.google.com/open?id=1nar0xzWBTxp0iiadsajR4qs6_zCpFshn",
          "https://drive.google.com/open?id=13WE0RWYkOXE45Ibw-ivf7n_XNGb0qgeK"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1x6QdZVdMZOmDDo7ETevy-nREHyeSSFoJ"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1FGYoNOR9EAsEEvgEutWT6BWSr9O_emQu",
          "https://drive.google.com/open?id=137PHII9Ys3itqD7z0SnFqJQrokaVsGRq",
          "https://drive.google.com/open?id=15F9hJiDTxhNhV9lMoj_PyVlIj7-jJ9xa",
          "https://drive.google.com/open?id=1DRNyOFiJehOZrE38O6vsyARC_p1MVuCj"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1KccRd9lEUsceC2odsfn3Yaj07vWjFuo2",
          "https://drive.google.com/open?id=1V6E8jEjZvmFlLtdbahTuFOkBJLTTeUv6"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0024",
    "timestamp": "6/14/2026 14:05:36",
    "date": "6/14/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1hcl-cz63yIFEqlVHYyMg6WdOAsPwUq-0"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1X3x8NJ_aq6e4m2JKTWFBTGR7oUg85IFk",
          "https://drive.google.com/open?id=1OFF-A2eooG-aMxTuWqXyBSctw7PW5OGQ",
          "https://drive.google.com/open?id=1SwdiVRhWw1LiPMZ-bPG0SC-gnNTCuBzo"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1Bp7QoYXNrroKITnqcFX7ezqGIiMogiK7"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1n0YjrSKrkvNR3hmH1Ul8Dza4CJNxEJNk"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1yfRTfSWuh6TV8ITsy2sW2rrEwXNnmq-3"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1lCPZ06woSdDQptvz-2XnM1aN44tX3h3c",
          "https://drive.google.com/open?id=1DUwMiIvRRnISDzFETbv_J-FAlRhF_4_M",
          "https://drive.google.com/open?id=1hJEwlk7jwlK3DQTNLvSeDhDBtIlNgHqk"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1R2lXIzMjQq6rLMs8h7kG1WQEDJPV1XQI"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1reR45cD_5P9PYh3eEfZJFTXXcFMh7qCl"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1DtOKQ8JJHtgsZMDVqaMPNGNqWG7FvkX5"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0026",
    "timestamp": "6/14/2026 14:31:57",
    "date": "6/14/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1jNRUEby_pUXJPskmWHwqu4XwFTytkr-9"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1l_m7g-kOtFkNwn_GPSmdLgH0AtcEHCAx"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1chSpzqhd4zca3cKeJ9ExQP-lA_5tJIRZ"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=199RoXkV3gNsCvCIe3r7YnyVGPCmMpAXe"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1X7ZcZ3RiI_tTGzHD7s4ZSs8OT88QDgBc"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1KYD80QgJBLDO5wxrQ8LZuhpCP2gPV73Q"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1hUcgDKK2bTFuuawaK8QBMbm18WbCHytu"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=18LqiztEkpqnk0XJoiRjXWMWRYOGFkPk6"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1ntl5Uv974y77sxvskRH6Yt7LscPmqZ53"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0028",
    "timestamp": "6/14/2026 21:23:49",
    "date": "6/14/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0030",
    "timestamp": "6/14/2026 21:41:15",
    "date": "6/14/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0032",
    "timestamp": "6/14/2026 22:29:30",
    "date": "6/14/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0034",
    "timestamp": "6/15/2026 14:01:23",
    "date": "6/15/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=17sUf37UaVQNim45cEiGKKGKNu0lSqrFa"
        ]
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1g3K3gvRMY4e5bFlUdrN7mSFGnEGekVff"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1xtryqXwKIitKLBmaaUkKcU9JFet3mfQR"
        ]
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1nkf5Ch9Gv3XEbJ3UwjnHfXghRJA4b60d"
        ]
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1GmIAXDXz7551D9uBNfB8YwDOm-O7hgUh"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1d3RjTcqpE1TfaGK_qpOT9jYtP00188FL"
        ]
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1pcgFljZpQvKYCkHWvNha4KzILlu8AvDe"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=12D8sgMH5GayaFSR-ZJeClJFiUyePKo6x"
        ]
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1W-HKzQSOc5yMYRQkTCSspjypmYCuIhI5"
        ]
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0036",
    "timestamp": "6/15/2026 14:41:42",
    "date": "6/15/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1rNtkl2RPzsvV-gyh08BaNdybQ6IChtcK"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1zZMtj4onSfF19zdgc-CRi32oQP79UeCH"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=11J7DVHVEHq3Ftw7LXIsrmwzaeowRyJcl"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0038",
    "timestamp": "6/15/2026 21:14:32",
    "date": "6/15/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0040",
    "timestamp": "6/15/2026 21:50:46",
    "date": "6/15/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0042",
    "timestamp": "6/16/2026 13:58:13",
    "date": "6/16/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1Qak5FG64Q1LAXc5v24g27S5qYxFtmP7X"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1hDbAVLnzBQsxZOFCl_zYIpRpRfu6yNPn"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=14hw_Ptgza45WOPgp30IxO-ekcJ3yDhBE"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0044",
    "timestamp": "6/16/2026 14:00:15",
    "date": "6/16/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1vk544208bFy5MoxN2p31Uw0HEKQSzqp4"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1AbuZoUw1OE7_CN6L8PhxabPIJmGH0Tiq"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1F8-IGwrgdZjxAohbyChUEspFYcJbmacI"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0046",
    "timestamp": "6/16/2026 14:00:39",
    "date": "6/16/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=14dDK40G9xLzQOYqMX-CqDyWBAEvJddge"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1kiRDN7Sf_0RKXm2Drjr3EPBYMboJvMvI"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1wD8ORzCxYqqdOqfu73vQYEAItz3SennT"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0048",
    "timestamp": "6/16/2026 21:13:19",
    "date": "6/16/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0050",
    "timestamp": "6/16/2026 21:17:28",
    "date": "6/16/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0052",
    "timestamp": "6/17/2026 0:15:11",
    "date": "6/17/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0054",
    "timestamp": "6/17/2026 13:49:43",
    "date": "6/17/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1fYTzOjerEq210fAd2gU_rnbrMBXnZOvd"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1WGp6EweDhO9rRBBJD5sHoDa70vXC_1uR"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1fV-zlChC9ZXj2DzhKcGIOFLt9rIcby0B"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0056",
    "timestamp": "6/17/2026 13:55:00",
    "date": "6/17/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1BvtzDbhD61n_T5Upt1gNfzCMSXb-uMj-"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1DmM-DVieFTT1-S6QMlky2cpC_z35nLIe"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=13dfXkP3DR5L2_oFv-Ag_sdUgB9wt_jC4"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0058",
    "timestamp": "6/17/2026 14:18:12",
    "date": "6/17/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn thị ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1GZLaMWRCh4t6sZt6DReIQ20I55SHUdG2",
          "https://drive.google.com/open?id=1pynXbv_p_fEETCCNs_-s4r9RFavFcnrr",
          "https://drive.google.com/open?id=1Ly6qM-wK-JnWhKjtIkawKS5dODiqM6nz",
          "https://drive.google.com/open?id=1_Cn8Nl85KW5K5as3IhAxswzMCtST17LK"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=13JP6Dw99nZQhBOHSrsZFnUDPXg-NNyax"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1vc8ylvyd8jHy1E-Fdj6T_uJ5MZwVXK8k"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0060",
    "timestamp": "6/17/2026 14:31:09",
    "date": "6/17/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1GQGPY-YYVCGdUjc5IFaf5WlXD1xo0tpg"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1abNP-PL9mlhULIjyczDd3UJTBurbHZJ2"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1fn-Bg-2Be7vPhdFU0rCcm8sltcEdgToV"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0062",
    "timestamp": "6/17/2026 21:43:24",
    "date": "6/17/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0064",
    "timestamp": "6/17/2026 21:43:46",
    "date": "6/17/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0066",
    "timestamp": "6/17/2026 22:46:12",
    "date": "6/17/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0068",
    "timestamp": "6/17/2026 22:46:54",
    "date": "6/17/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyên Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0070",
    "timestamp": "6/18/2026 14:08:57",
    "date": "6/18/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1xBaN0Ouam5kdvq1VhZ8IZq8wNaEtgReJ"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1anAg0rT8Pi5bduRbcRhd6oh9etlejIrh"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1TtAf2rJrCbGXNredRVL5hQYXhCpCGaOu"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0072",
    "timestamp": "6/18/2026 14:11:52",
    "date": "6/18/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1w77GyAKiHF2w3o7WgVX-c-OioxiCpuqx"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1fY5vi2h2dCMgna6l3fUTDGq5fqjDk2N0"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1KouvGD7TPx-sQ_2gq6xwHPL7cVDqfTiS"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0074",
    "timestamp": "6/18/2026 15:06:03",
    "date": "6/18/2026",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Trần Thị Kim Chi",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1XCC_SPHdvWdu2rxE4e-A--LEA2a0qSkk"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1Tn_YuvjrosVg3OlEPY1U2MFziNGDHU9y"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1zYOsVg0kiHYeycGvaT0i-KDKvf-wt9PY"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0076",
    "timestamp": "6/18/2026 15:33:13",
    "date": "6/18/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1mzr3c2FZ7FXAgK0NDqsdgK1p2IvvAT4d",
          "https://drive.google.com/open?id=1UVdb0rTsmg_5-d6M8DNT2f9DW75UYV5B",
          "https://drive.google.com/open?id=1PFTjmBRSBPJmfyt12KUzzDla4qAhmUHn"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=19hjrzRQJHN4YxdX_CWYMNlJ29IdRTYHB"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=16e43oTdVJbV9kFY4M5AaF9EBjMQCtGb-"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0078",
    "timestamp": "6/18/2026 22:02:41",
    "date": "6/18/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn thị ngọc ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0080",
    "timestamp": "6/18/2026 22:11:03",
    "date": "6/18/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0082",
    "timestamp": "6/18/2026 23:32:50",
    "date": "6/18/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0084",
    "timestamp": "6/19/2026 13:58:20",
    "date": "6/19/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1sp3wrwbEdif-5YC4--xg-K07MzCbDDh6"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1lMs7W2W2JYL-r_wdlfjDL85wbddFV3Us"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1BuENENi4wHXVqIcSfrGz6oj7z05ZoxPh"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0086",
    "timestamp": "6/19/2026 13:59:17",
    "date": "6/19/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1bzJii9h5Lyqg8V-7SdzFJIDPj5kNpOn3",
          "https://drive.google.com/open?id=13hPbqNdiR7A-d4HBG0tsal40nfB1wbWA"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1e957-qsjLC_qdVXRbvng_3L9SfyoHSpo",
          "https://drive.google.com/open?id=1FmwgEYWHEHGWipRVf6vZ2IcdjfuOYZ8o"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=16tqndbdTwmE3wZ02rhqC8t1yx0Gr3afg"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0088",
    "timestamp": "6/19/2026 14:04:39",
    "date": "6/19/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1LyFURg_NcUlMF0DwuIVRf2OI-hrGeb20"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=15I_W_Jdwzx2NH_y__YebkezTGS0fT4p9"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=16Q2Wp2XFMcs5R2hToODHjJ0_SMQhIBsr"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0090",
    "timestamp": "6/19/2026 14:16:49",
    "date": "6/19/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=13vuqRoO75Xrn2lG5vksxpJLrPRsYDaUv"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=10QY0QfdQVwmceQ5O2nXrYsKEiJ0AL6e-"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1sdszg9oXGC7fFyZeYojTQWgyRwB0cZHV"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0092",
    "timestamp": "6/19/2026 21:19:47",
    "date": "6/19/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0094",
    "timestamp": "6/19/2026 21:33:11",
    "date": "6/19/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn thii ngọc ánh",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0096",
    "timestamp": "6/19/2026 22:23:16",
    "date": "6/19/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0098",
    "timestamp": "6/20/2026 13:54:48",
    "date": "6/20/2026",
    "branch": "CS5 47 Nguyễn Tuân",
    "staffName": "Trần Thị Kim Chi",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1_Z-oB4m6zdHiX1rZaRIkm-LNmDi1Syzi"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1bCh0WNy_aOA9vWdmfemDWUaPjdil3Iek"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1iaNuS1ETLeOf1OgsY6qjDa8sPf09pQBE"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0100",
    "timestamp": "6/20/2026 14:05:01",
    "date": "6/20/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1FAKV4vww4mnzeLdTYltRZQ2rFuKTOO3N"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1x7qjY1jyw7LNWxd7HEI6A42hOPBKqhZO"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=11Nvfn1w_7vfenJA_t2RreCVwgkQeASJr"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0102",
    "timestamp": "6/20/2026 14:20:06",
    "date": "6/20/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Trần Mai Chi",
    "shift": "dau_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1KnP3DSHept_KQqEU1qGvTihSmi5PzkWv"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1CpoqmrdUkUIE5H5uIVcgkAJnLemmudE1"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1h9g5i5mXqUZhDPHHH52pNJkTFHCxtOji"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0104",
    "timestamp": "6/20/2026 20:08:36",
    "date": "6/20/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Trần Mai Chi",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0106",
    "timestamp": "6/20/2026 22:36:20",
    "date": "6/20/2026",
    "branch": "CS7 170 Nguyễn Tuân",
    "staffName": "Lê Thị Vân",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0108",
    "timestamp": "6/21/2026 14:21:15",
    "date": "6/21/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1kbnB1-UPtBKvkHvGydk8Jhy0H3hjX-oz"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=16skYRQuqO08svDNajc0DBdpNRj_3gVMe"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1G4iDhroTjpl_tJlk4viKVgLfRMkGHcy4"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0110",
    "timestamp": "6/21/2026 14:23:59",
    "date": "6/21/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1g5vCmjeopPyhjr9s2fVKOb7HyKkWSrQn"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1zaf-GUs4ViAYNSnhGOQXcWy1H46XFsj8"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1GZNBtFAR7m1j_--rbM179xo7qM9bLBKp"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0112",
    "timestamp": "6/21/2026 14:30:58",
    "date": "6/21/2026",
    "branch": "CS1 Linh Đàm",
    "staffName": "Nguyễn Thị Ngọc Ánh",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1XOo4oobVwKBNgs5DoIkepXDvZUh8XbcY",
          "https://drive.google.com/open?id=1axzMfU5lu8A44MYi3pAycwqwWffhO6JF",
          "https://drive.google.com/open?id=1sEPKECAjig0gqAvvMwrZAc2FeIcFUPcD",
          "https://drive.google.com/open?id=1WWj3YiiPrhTxt9w61W1F9BRUKnqw1tjy",
          "https://drive.google.com/open?id=1IEXyOqipNKUEFR-M51MI9CB7wdtJz2u2"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1cNhwxUW0AOFPqRBjYQCq8Msl1bklsu1S"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1QfduvTjI31CnaJFxQG0Xgtmj_D7K0_EV"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0114",
    "timestamp": "6/21/2026 22:08:29",
    "date": "6/21/2026",
    "branch": "CS6 Tonkin",
    "staffName": "Bùi Duy Quang",
    "shift": "cuoi_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0116",
    "timestamp": "6/21/2026 22:54:31",
    "date": "6/21/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "cuoi_ca",
    "status": "late",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": []
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": []
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": []
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  },
  {
    "id": "chk_0118",
    "timestamp": "6/22/2026 14:18:48",
    "date": "6/22/2026",
    "branch": "CS3 Vin SA1",
    "staffName": "Nguyễn Thị Thu Ngân",
    "shift": "dau_ca",
    "status": "on_time",
    "daytimeItems": [
      {
        "key": "sanh_ngoai",
        "name": "Sảnh ngoài",
        "status": "pass",
        "photos": []
      },
      {
        "key": "sanh_le_tan",
        "name": "Sảnh lễ tân / Hành lang",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1LszHecJqzRJojLbOnzG_fp8Hw4zPgxX9"
        ]
      },
      {
        "key": "quay_le_tan",
        "name": "Quầy lễ tân",
        "status": "pass",
        "photos": []
      },
      {
        "key": "khu_ipad",
        "name": "Khu vực iPad",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tu_qua",
        "name": "Khu vực tủ quà",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=1eRG8LA02kcI5EZ1KbOLj5g2GOqbODoIW"
        ]
      },
      {
        "key": "phong_hoc",
        "name": "Phòng học",
        "status": "pass",
        "photos": []
      },
      {
        "key": "nha_ve_sinh",
        "name": "Khu vực nhà vệ sinh",
        "status": "pass",
        "photos": [
          "https://drive.google.com/open?id=14O1chmsbLjc9kZ0o3c7hqeg3H6zCaXvk"
        ]
      },
      {
        "key": "ha_tang",
        "name": "Hạ tầng trung tâm",
        "status": "pass",
        "photos": []
      },
      {
        "key": "tac_phong",
        "name": "Tác phong nhân sự",
        "status": "pass",
        "photos": []
      }
    ],
    "closingItems": [
      {
        "id": "closing_ac_tv",
        "name": "Điều hòa & Tivi",
        "status": "done"
      },
      {
        "id": "closing_tv_devices",
        "name": "Tivi & Thiết bị phòng học",
        "status": "done"
      },
      {
        "id": "closing_pc_printer",
        "name": "Máy tính & Máy in",
        "status": "done"
      },
      {
        "id": "closing_ipad",
        "name": "Hệ thống iPad",
        "status": "done"
      },
      {
        "id": "closing_trash",
        "name": "Thu gom rác mặt bằng",
        "status": "done"
      },
      {
        "id": "closing_furniture",
        "name": "Sắp xếp bàn ghế",
        "status": "done"
      },
      {
        "id": "closing_gift_shelf",
        "name": "Sắp xếp tủ quà",
        "status": "done"
      },
      {
        "id": "closing_play_area",
        "name": "Khu đồ chơi / Khu chờ",
        "status": "done"
      },
      {
        "id": "closing_security",
        "name": "Khóa cửa an toàn",
        "status": "done"
      }
    ],
    "passRate": 100,
    "failedItemsCount": 0,
    "escalatedToQc": false,
    "qcIncidentCode": null
  }
]

export function getDailyCheckSubmissions(filters?: {
  branch?: string
  shift?: string
  status?: string
  search?: string
  date?: string
}): DailyCheckSubmission[] {
  return mockDailyCheckSubmissions.filter((item) => {
    if (filters?.branch && filters.branch !== 'all' && item.branch !== filters.branch) return false
    if (filters?.shift && filters.shift !== 'all' && item.shift !== filters.shift) return false
    if (filters?.status && filters.status !== 'all' && item.status !== filters.status) return false
    if (filters?.search) {
      const q = filters.search.toLowerCase()
      const matchStaff = item.staffName.toLowerCase().includes(q)
      const matchBranch = item.branch.toLowerCase().includes(q)
      const matchId = item.id.toLowerCase().includes(q)
      if (!matchStaff && !matchBranch && !matchId) return false
    }
    return true
  })
}

export function getDailyCatalog(): DailyCatalogItem[] {
  return DAILY_CATALOG_ITEMS
}

export function getDailyClosingTasks(): DailyClosingTask[] {
  return DAILY_CLOSING_TASKS
}

export function getDailyCatalogVersions(): DailyCatalogVersion[] {
  return MOCK_CATALOG_VERSIONS
}

export function getDailyCatalogProposals(): DailyCatalogProposal[] {
  return MOCK_CATALOG_PROPOSALS
}
