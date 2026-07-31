import type { BookingSubject } from '@/mocks/bookingTests'
import type { ConditionFilter, StatusConfigItem } from './bookingTestTypes'

export const BOOKING_SUBJECTS: BookingSubject[] = ['english', 'math']

export const STATUS_CONFIG: StatusConfigItem[] = [
  { id: 'booked_assessment', label: 'Đã đặt lịch test', status: 'booked_assessment' },
  { id: 'unassigned_teacher', label: 'Chưa gán GV', status: 'unassigned_teacher' },
  { id: 'checkin', label: 'Đã check-in', status: 'checkin' },
  { id: 'interviewed', label: 'Đã phỏng vấn', status: 'interviewed' },
  { id: 'tested', label: 'Đã làm bài', status: 'tested' },
  { id: 'completed', label: 'Hoàn tất', status: 'completed' },
  { id: 'failed', label: 'Không đạt', status: 'failed' },
  { id: 'cancelled', label: 'Đã hủy', status: 'cancelled' },
]

export const STATUS_META = Object.fromEntries(
  STATUS_CONFIG.map((status) => [status.id, status])
) as Record<StatusConfigItem['id'], StatusConfigItem>

export const BOOKING_SLOT_TIMES = Array.from({ length: 27 }, (_, index) => {
  const minutes = 9 * 60 + index * 30
  const hour = Math.floor(minutes / 60)
  const minute = minutes % 60
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
})

export const PROGRAM_OPTIONS = [
  'Station Program',
  'IELTS Foundation',
  'Tiếng Anh thiếu nhi',
  'Toán tư duy',
  'Toán Olympiad',
]

export const FILTER_CONDITIONS: Array<{ id: ConditionFilter; label: string }> = [
  { id: 'interviewed', label: 'Đã phỏng vấn' },
  { id: 'tested', label: 'Đã làm bài' },
  { id: 'failed', label: 'Không đạt' },
  { id: 'checkin', label: 'Đã check-in' },
]

// ─── English Assessment Constants ─────────────────────────────────────

export const TEST_TYPE_OPTIONS = [
  { value: 'preStarters', label: 'Pre-Starters (≤ 6 tuổi)' },
  { value: 'starters', label: 'Starters (> 6 và ≤ 8 tuổi)' },
  { value: 'movers', label: 'Movers (> 8 và ≤ 10 tuổi)' },
  { value: 'flyers', label: 'Flyers (> 10 tuổi)' },
]

export const SCORE_ROW_OPTIONS = [
  { key: 'zero', value: 0 as const, label: '0 điểm' },
  { key: 'half', value: 0.5 as const, label: '0.5 điểm' },
  { key: 'one', value: 1 as const, label: '1 điểm' },
]

export const FEEDBACK_PROMPTS = [
  {
    key: 'confidence',
    prompt: 'Học sinh trả lời câu hỏi của giáo viên theo cách:',
    positive: 'Tự tin trong giao tiếp',
    negative: 'Thiếu tự tin, ngại nói',
  },
  {
    key: 'vocabulary',
    prompt: 'Sử dụng từ vựng:',
    positive: 'Sử dụng từ vựng chính xác, phù hợp',
    negative: 'Bỏ sót từ khóa quan trọng',
  },
  {
    key: 'sentenceUse',
    prompt: 'Cấu trúc câu:',
    positive: 'Nói thành câu đầy đủ, rõ ràng, mạch lạc',
    negative: 'Chỉ nói từ đơn lẻ',
  },
  {
    key: 'intonation',
    prompt: 'Ngữ âm và trọng âm:',
    positive: 'Ngữ điệu tự nhiên, trọng âm đúng',
    negative: 'Ngữ điệu và trọng âm sai',
  },
  {
    key: 'fluency',
    prompt: 'Độ lưu loát:',
    positive: 'Nói lưu loát, phản xạ nhanh',
    negative: 'Ngập ngừng, phản xạ chậm',
  },
  {
    key: 'ideaExpression',
    prompt: 'Diễn đạt ý tưởng:',
    positive: 'Có khả năng diễn đạt ý tưởng bằng tiếng Anh',
    negative: 'Pha lẫn tiếng Anh và tiếng Việt',
  },
  {
    key: 'wordRecognition',
    prompt: 'Nhận diện từ:',
    positive: 'Đánh vần và nhận diện từ tốt',
    negative: 'Nhận diện từ kém',
  },
]

export const WEAKNESS_OPTIONS = [
  { key: 'lacksConfidence', label: 'Thiếu tự tin, ngại nói' },
  { key: 'missesKeywords', label: 'Bỏ sót từ khóa quan trọng' },
  { key: 'singleWords', label: 'Chỉ nói từ đơn lẻ' },
  { key: 'incorrectPronunciation', label: 'Phát âm sai, thiếu âm cuối' },
  { key: 'incorrectIntonation', label: 'Ngữ điệu và trọng âm sai' },
  { key: 'hesitantSpeech', label: 'Ngập ngừng, phản xạ chậm' },
  { key: 'mixesLanguages', label: 'Pha lẫn tiếng Anh và tiếng Việt' },
  { key: 'poorWordRecognition', label: 'Nhận diện từ kém' },
]

export const VOCAB_LEVEL_OPTIONS = [
  { value: 'limited', label: 'hạn chế' },
  { value: 'basic', label: 'cơ bản' },
  { value: 'rich', label: 'phong phú, đa dạng' },
]

export const GRAMMAR_ERROR_OPTIONS = [
  { key: 'missingS', label: 'lỗi thiếu “s” sau danh từ số nhiều' },
  { key: 'verbTense', label: 'lỗi về thì của động từ' },
  { key: 'subjectVerbAgreement', label: 'lỗi về sự hòa hợp giữa thì của chủ ngữ và động từ' },
  { key: 'wrongStructure', label: 'sử dụng sai cấu trúc' },
  { key: 'wrongWordOrder', label: 'sử dụng sai trật tự câu' },
]

export const OPEN_QUESTION_OPTIONS = [
  { value: 'cannotAnswer', label: 'chưa trả lời được' },
  { value: 'needsSupport', label: 'trả lời được nhưng cần sự hỗ trợ từ GV' },
  { value: 'fluentExpanded', label: 'trả lời trôi chảy, mở rộng ý tốt' },
]

export const PRONUNCIATION_ERROR_OPTIONS = [
  { key: 'noEndingSound', label: 'không phát âm âm cuối' },
  { key: 'wrongEndingSound', label: 'phát âm sai âm cuối' },
  { key: 'wrongStress', label: 'đặt trọng âm sai vị trí' },
]

export const FLUENCY_PAIRS = [
  {
    key: 'confidence',
    positive: 'tự tin',
    negative: 'chưa tự tin',
  },
  {
    key: 'smoothness',
    positive: 'trôi chảy, lưu loát',
    negative: 'còn ngập ngừng, ngắt quãng',
  },
  {
    key: 'reflex',
    positive: 'phản xạ nhanh',
    negative: 'phản xạ chưa nhanh',
  },
  {
    key: 'naturalness',
    positive: 'linh hoạt, tự nhiên',
    negative: 'chưa tự nhiên',
  },
]

export const FORM_2025_COLUMNS = Array.from({ length: 8 }, (_, i) => String(i + 1))
export const OLD_FORM_COLUMNS = Array.from({ length: 32 }, (_, i) => String(i + 1))
