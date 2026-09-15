export interface MathThinkingSkillConfig {
  id: string
  label: string
  shortLabel: string
  icon: string
  ratingKey:
    | 'mathBasic'
    | 'mathLogic'
    | 'mathMath'
    | 'mathCreative'
    | 'mathCritical'
    | 'evaluation'
    | 'mathArithmetic'
    | 'mathSpatial'
    | 'mathModeling'
  strengthKey:
    | 'mathBasicStrength'
    | 'mathLogicStrength'
    | 'mathMathStrength'
    | 'mathCreativeStrength'
    | 'mathCriticalStrength'
    | 'strength'
    | 'mathArithmeticStrength'
    | 'mathSpatialStrength'
    | 'mathModelingStrength'
  weaknessKey:
    | 'mathBasicWeakness'
    | 'mathLogicWeakness'
    | 'mathMathWeakness'
    | 'mathCreativeWeakness'
    | 'mathCriticalWeakness'
    | 'weakness'
    | 'mathArithmeticWeakness'
    | 'mathSpatialWeakness'
    | 'mathModelingWeakness'
  description: string
  subSkills: string[]
  suggestions: {
    strength: string[]
    weakness: string[]
  }
}

export const MATH_THINKING_SKILLS: MathThinkingSkillConfig[] = [
  {
    id: 'basic',
    label: '1. Tư duy cơ bản',
    shortLabel: 'Tư duy cơ bản',
    icon: '🧠',
    ratingKey: 'mathBasic',
    strengthKey: 'mathBasicStrength',
    weaknessKey: 'mathBasicWeakness',
    description: 'Đánh giá khả năng quan sát, mức độ tập trung và khả năng ghi nhớ thông tin.',
    subSkills: [
      'Khả năng quan sát',
      'Tập trung',
      'Ghi nhớ',
    ],
    suggestions: {
      strength: [
        'Khả năng quan sát nhanh nhạy',
        'Tập trung chú ý cao',
        'Ghi nhớ tốt kiến thức',
        'Tiếp thu bài học nhanh',
        'Quan sát chi tiết tỉ mỉ',
      ],
      weakness: [
        'Còn xao nhãng trong giờ học',
        'Cần rèn luyện khả năng quan sát',
        'Hay quên các bước cơ bản',
        'Cần thầy cô nhắc nhở để tập trung',
      ],
    },
  },
  {
    id: 'logic',
    label: '2. Tư duy logic',
    shortLabel: 'Tư duy logic',
    icon: '🧩',
    ratingKey: 'mathLogic',
    strengthKey: 'mathLogicStrength',
    weaknessKey: 'mathLogicWeakness',
    description: 'Phân tích, tổng hợp vấn đề và liên hệ với đời sống thực tiễn hằng ngày.',
    subSkills: [
      'Phân tích, tổng hợp vấn đề',
      'Liên hệ với đời sống thực tiễn hằng ngày',
    ],
    suggestions: {
      strength: [
        'Phân tích, tổng hợp vấn đề tốt',
        'Liên hệ thực tiễn nhanh nhạy',
        'Suy luận logic chặt chẽ',
        'Xâu chuỗi dữ kiện logic',
      ],
      weakness: [
        'Phân tích vấn đề còn lúng túng',
        'Chưa xâu chuỗi tốt các giả thiết',
        'Cần liên hệ thực tiễn nhiều hơn',
        'Suy luận còn theo cảm tính',
      ],
    },
  },
  {
    id: 'math',
    label: '3. Tư duy Toán học',
    shortLabel: 'Tư duy Toán học',
    icon: '🔢',
    ratingKey: 'mathMath',
    strengthKey: 'mathMathStrength',
    weaknessKey: 'mathMathWeakness',
    description: 'Số và Các phép tính, Hình học phẳng, Hình học không gian, Đại lượng và đo lường, Thống kê và xác suất.',
    subSkills: [
      'Số và Các phép tính',
      'Hình học phẳng',
      'Hình học không gian',
      'Đại lượng và đo lường',
      'Thống kê và xác suất',
    ],
    suggestions: {
      strength: [
        'Nắm chắc Số và Các phép tính',
        'Nhận biết tốt hình học phẳng & không gian',
        'Hiểu rõ đại lượng và đo lường',
        'Đọc hiểu bảng thống kê & xác suất tốt',
        'Tính nhẩm nhanh và chuẩn xác',
      ],
      weakness: [
        'Còn nhầm lẫn phép tính cơ bản',
        'Khó tưởng tượng hình học không gian',
        'Cần củng cố về đại lượng và đo lường',
        'Lúng túng khi xử lý bảng số liệu thống kê',
        'Cần cẩn thận khi đặt tính nháp',
      ],
    },
  },
  {
    id: 'creative',
    label: '4. Tư duy sáng tạo',
    shortLabel: 'Tư duy sáng tạo',
    icon: '💡',
    ratingKey: 'mathCreative',
    strengthKey: 'mathCreativeStrength',
    weaknessKey: 'mathCreativeWeakness',
    description: 'Khả năng sáng tạo khác biệt, nghĩ khác và làm khác khi giải quyết bài toán.',
    subSkills: [
      'Khả năng sáng tạo khác biệt nghĩ khác, làm khác',
    ],
    suggestions: {
      strength: [
        'Khả năng sáng tạo khác biệt, nghĩ khác, làm khác',
        'Tìm ra nhiều cách giải mới mẻ',
        'Ý tưởng độc đáo và linh hoạt',
        'Tò mò và ham khám phá bài toán mở',
      ],
      weakness: [
        'Còn rập khuôn theo bài mẫu',
        'Chưa dám thử nghiệm cách làm mới',
        'Cần khuyến khích tư duy mở và linh hoạt',
      ],
    },
  },
  {
    id: 'critical',
    label: '5. Tư duy phản biện và giải quyết vấn đề',
    shortLabel: 'Phản biện & GQVĐ',
    icon: '🎯',
    ratingKey: 'mathCritical',
    strengthKey: 'mathCriticalStrength',
    weaknessKey: 'mathCriticalWeakness',
    description: 'Tự tin thể hiện ý kiến cá nhân, bảo vệ quan điểm, kỹ năng thuyết trình, giải quyết vấn đề sáng tạo và hiệu quả.',
    subSkills: [
      'Tự tin thể hiện ý kiến, quan điểm cá nhân',
      'Bảo vệ ý kiến',
      'Kĩ năng thuyết trình',
      'Kỹ năng giải quyết vấn đề sáng tạo và hiệu quả',
    ],
    suggestions: {
      strength: [
        'Tự tin thể hiện ý kiến, quan điểm cá nhân',
        'Bảo vệ ý kiến có lập luận vững vàng',
        'Kỹ năng thuyết trình mạch lạc, rõ ràng',
        'Giải quyết vấn đề sáng tạo và hiệu quả',
        'Chủ động đặt câu hỏi phản biện',
      ],
      weakness: [
        'Còn rụt rè, ngại chia sẻ ý kiến',
        'Chưa tự tin bảo vệ quan điểm',
        'Kỹ năng thuyết trình còn rụt rè',
        'Lúng túng khi gặp vấn đề phức tạp',
      ],
    },
  },
]

export const MATH_ATTITUDE_LABELS: Record<number, string> = {
  1: '1 - Yếu',
  2: '2 - Cần cải thiện',
  3: '3 - Chưa đạt yêu cầu',
  4: '4 - Đạt yêu cầu',
  5: '5 - Xuất sắc',
}

export const MATH_HOMEWORK_OPTIONS = [
  { value: 'Hoàn thành', altValue: 'Done', label: 'Hoàn thành', type: 'done' },
  { value: 'Hoàn thành 1 phần', altValue: 'Partly Done', label: 'Hoàn thành 1 phần', type: 'partly' },
  { value: 'Chưa làm', altValue: 'Not Yet', label: 'Chưa làm', type: 'not_yet' },
  { value: 'Không có', altValue: 'No Homework', label: 'Không có', type: 'none' },
]

export const MATH_EVALUATION_OPTIONS = [
  { value: 1, label: '1 - Yếu' },
  { value: 2, label: '2 - Cần cải thiện' },
  { value: 3, label: '3 - Chưa đạt yêu cầu' },
  { value: 4, label: '4 - Đạt yêu cầu' },
  { value: 5, label: '5 - Xuất sắc' },
]

export const MATH_REMINDERS_COL_1 = [
  'Vào lớp đúng giờ (tự động cập nhật)',
  'Tự tin tương tác với thầy cô và các bạn trong lớp',
  'Kiểm tra lại chất lượng mạng internet',
  'Sửa lỗi mic',
  'Lễ phép với thầy cô',
  'Ngồi ngay ngắn, đúng tư thế trong giờ học',
]

export const MATH_REMINDERS_COL_2 = [
  'Cần tập trung hơn và không làm việc riêng trong lớp',
  'Không tắt cam trong buổi học',
  'Sửa lỗi cam',
  'Tránh ngồi học nơi có nhiều tiếng ồn, nhiều người qua lại',
  'Chỉnh lại camera cho ngay ngắn',
]
