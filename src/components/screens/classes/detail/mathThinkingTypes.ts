export interface MathThinkingSkillConfig {
  id: string
  label: string
  shortLabel: string
  icon: string
  ratingKey: 'evaluation' | 'mathLogic' | 'mathArithmetic' | 'mathSpatial' | 'mathModeling'
  strengthKey: 'strength' | 'mathLogicStrength' | 'mathArithmeticStrength' | 'mathSpatialStrength' | 'mathModelingStrength'
  weaknessKey: 'weakness' | 'mathLogicWeakness' | 'mathArithmeticWeakness' | 'mathSpatialWeakness' | 'mathModelingWeakness'
  description: string
  suggestions: {
    strength: string[]
    weakness: string[]
  }
}

export const MATH_THINKING_SKILLS: MathThinkingSkillConfig[] = [
  {
    id: 'problem_solving',
    label: 'Giải quyết vấn đề & trình bày',
    shortLabel: 'Giải quyết vấn đề',
    icon: '💡',
    ratingKey: 'evaluation',
    strengthKey: 'strength',
    weaknessKey: 'weakness',
    description: 'Khả năng phân tích yêu cầu đề bài, tìm hướng giải và trình bày các bước rõ ràng.',
    suggestions: {
      strength: [
        'Trình bày mạch lạc, rõ ràng',
        'Độc lập giải quyết bài toán',
        'Hiểu rõ dữ kiện đề bài',
        'Tự tin chia sẻ cách làm',
      ],
      weakness: [
        'Trình bày còn tắt bước',
        'Chưa đọc kỹ dữ kiện đề bài',
        'Cần rèn tính kiên nhẫn khi gặp bài khó',
        'Chưa có thói quen kiểm tra đáp số',
      ],
    },
  },
  {
    id: 'logic',
    label: 'Tư duy Logic & Suy luận',
    shortLabel: 'Logic & Suy luận',
    icon: '🧩',
    ratingKey: 'mathLogic',
    strengthKey: 'mathLogicStrength',
    weaknessKey: 'mathLogicWeakness',
    description: 'Suy luận logic, phát hiện mâu thuẫn, xâu chuỗi dữ kiện và lập luận bài toán chặt chẽ.',
    suggestions: {
      strength: [
        'Suy luận logic sắc bén',
        'Lập luận có căn cứ rõ ràng',
        'Phản xạ nhanh với câu hỏi mở',
        'Hiểu sâu bản chất vấn đề',
      ],
      weakness: [
        'Dễ bối rối khi đề bài đổi hướng',
        'Cần thầy cô định hướng từng bước',
        'Chưa xâu chuỗi tốt các giả thiết',
        'Suy luận còn theo cảm tính',
      ],
    },
  },
  {
    id: 'arithmetic',
    label: 'Tư duy Số học & Tính toán',
    shortLabel: 'Số học & Tính toán',
    icon: '🔢',
    ratingKey: 'mathArithmetic',
    strengthKey: 'mathArithmeticStrength',
    weaknessKey: 'mathArithmeticWeakness',
    description: 'Cảm nhận số học, tính nhẩm, phản xạ bảng tính và độ chuẩn xác của phép tính.',
    suggestions: {
      strength: [
        'Tính nhẩm nhanh và chuẩn xác',
        'Nắm vững bản chất phép tính',
        'Phản xạ số học tốt',
        'Vận dụng linh hoạt bảng số',
      ],
      weakness: [
        'Còn nhầm lẫn dấu phép tính',
        'Tính nhẩm còn chậm',
        'Cần cẩn thận khi đặt tính',
        'Dễ sai sót ở bước tính nhẩm',
      ],
    },
  },
  {
    id: 'spatial',
    label: 'Tư duy Hình học & Không gian',
    shortLabel: 'Hình học & Không gian',
    icon: '📐',
    ratingKey: 'mathSpatial',
    strengthKey: 'mathSpatialStrength',
    weaknessKey: 'mathSpatialWeakness',
    description: 'Trực quan không gian, nhận biết đặc điểm hình học, xoay lật và phân tích khối hình.',
    suggestions: {
      strength: [
        'Tưởng tượng không gian tốt',
        'Nhận biết hình dạng nhanh nhạy',
        'Quan sát trực quan đa chiều',
        'Phân biệt chính xác các khối hình',
      ],
      weakness: [
        'Khó tưởng tượng từ hình phẳng sang khối',
        'Còn nhầm lẫn góc và cạnh',
        'Cần sử dụng học cụ trực quan hỗ trợ',
        'Vẽ hình minh họa còn lúng túng',
      ],
    },
  },
  {
    id: 'modeling',
    label: 'Tư duy Quy luật & Mô hình hóa',
    shortLabel: 'Quy luật & Mô hình hóa',
    icon: '📊',
    ratingKey: 'mathModeling',
    strengthKey: 'mathModelingStrength',
    weaknessKey: 'mathModelingWeakness',
    description: 'Tìm quy luật chuỗi số/hình, chuyển bài toán thành sơ đồ đoạn thẳng hoặc mô hình hóa.',
    suggestions: {
      strength: [
        'Phát hiện quy luật chuỗi nhanh',
        'Mô hình hóa bài toán bằng sơ đồ tốt',
        'Nhạy bén với chuỗi hình lặp lại',
        'Áp dụng công thức quy luật linh hoạt',
      ],
      weakness: [
        'Lúng túng với bài toán tìm quy luật',
        'Chưa biết vẽ sơ đồ tóm tắt đề',
        'Cần thêm ví dụ trực quan cụ thể',
        'Khó chuyển lời văn thành mô hình số',
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
