import type { BookingTest } from '@/mocks/bookingTests'
import type { AssessmentDraft, ScoreValue } from './bookingTestTypes'

const score2025Samples: Record<string, Record<string, ScoreValue>> = {
  E0001: { '1': 1, '2': 1, '3': 0.5, '4': 1, '5': 0.5, '6': 1, '7': 1, '8': 0.5 },
  E0002: { '1': 0.5, '2': 1, '3': 0.5, '4': 0.5, '5': 0.5, '6': 1, '7': 0.5, '8': 0.5 },
  E0005: { '1': 1, '2': 1, '3': 1, '4': 1, '5': 1, '6': 1, '7': 0.5, '8': 1 },
}

const oldScoreSamples: Record<string, Record<string, ScoreValue>> = {
  E0001: Object.fromEntries(
    Array.from({ length: 32 }, (_, index) => [
      String(index + 1),
      index % 8 === 2 || index % 8 === 6 ? 0.5 : 1,
    ])
  ) as Record<string, ScoreValue>,
  E0002: Object.fromEntries(
    Array.from({ length: 32 }, (_, index) => [
      String(index + 1),
      index % 5 === 0 ? 0 : index % 2 === 0 ? 0.5 : 1,
    ])
  ) as Record<string, ScoreValue>,
  E0005: Object.fromEntries(
    Array.from({ length: 32 }, (_, index) => [
      String(index + 1),
      index % 11 === 0 ? 0.5 : 1,
    ])
  ) as Record<string, ScoreValue>,
}

function resolveScoresForBooking(booking: BookingTest): {
  scoreSelections: Record<string, ScoreValue>
  oldScoreSelections: Record<string, ScoreValue>
} | null {
  if (score2025Samples[booking.id] && oldScoreSamples[booking.id]) {
    return {
      scoreSelections: score2025Samples[booking.id],
      oldScoreSelections: oldScoreSamples[booking.id],
    }
  }

  const rawSpeaking = booking.testResult?.speaking?.trim()
  if (!rawSpeaking || rawSpeaking === '-' || rawSpeaking === 'chưa có') {
    return null
  }

  const match = rawSpeaking.match(/^([\d.]+)\s*\/\s*8/)
  const total = match ? parseFloat(match[1]) : parseFloat(rawSpeaking)
  if (Number.isNaN(total)) return null

  // Phân bổ 8 tiêu chí điểm Form 2025 khớp chuẩn với điểm tổng
  const scoreSelections: Record<string, ScoreValue> = {}
  let remaining = Math.max(0, Math.min(8, total))
  for (let i = 1; i <= 8; i++) {
    const key = String(i)
    if (remaining >= 1) {
      scoreSelections[key] = 1
      remaining -= 1
    } else if (remaining >= 0.5) {
      scoreSelections[key] = 0.5
      remaining -= 0.5
    } else {
      scoreSelections[key] = 0
    }
  }

  const oldScoreSelections: Record<string, ScoreValue> = Object.fromEntries(
    Array.from({ length: 32 }, (_, index) => {
      const ratio = total / 8
      const val: ScoreValue = (index / 32) < ratio ? (index % 5 === 0 ? 0.5 : 1) : 0
      return [String(index + 1), val]
    })
  )

  return { scoreSelections, oldScoreSelections }
}

export function buildSampleAssessmentDraft(booking: BookingTest): AssessmentDraft | null {
  const scores = resolveScoresForBooking(booking)
  if (!scores) return null
  const { scoreSelections, oldScoreSelections } = scores

  const rawSpeaking = booking.testResult?.speaking?.trim()
  const match = rawSpeaking ? rawSpeaking.match(/^([\d.]+)\s*\/\s*8/) : null
  const numericScore = match ? parseFloat(match[1]) : 6
  const isStrong = numericScore >= 6

  const rawLevel = (booking.testResult?.level || booking.expectedLevel || '').toLowerCase()
  const testType = rawLevel.includes('flyer') || numericScore >= 7.5
    ? 'flyers'
    : rawLevel.includes('starter')
      ? 'starters'
      : rawLevel.includes('mover')
        ? 'starters'
        : 'preStarters'

  return {
    evaluatorId: booking.teacher ?? '',
    testType: booking.id === 'E0005' ? 'flyers' : booking.id === 'E0002' ? 'preStarters' : testType,
    selectedTab: 'form2025',
    isSkipped2025: false,
    weaknesses:
      booking.id === 'E0002' || !isStrong
        ? ['missesKeywords', 'singleWords', 'hesitantSpeech']
        : ['incorrectPronunciation', 'incorrectIntonation', 'hesitantSpeech'],
    feedbackAnswers: {
      confidence: isStrong ? 'positive' : 'negative',
      vocabulary: isStrong ? 'positive' : 'negative',
      sentenceUse: isStrong ? 'positive' : 'negative',
      intonation: 'negative',
      fluency: numericScore >= 7 ? 'positive' : 'negative',
      ideaExpression: isStrong ? 'positive' : 'negative',
      wordRecognition: isStrong ? 'positive' : 'negative',
    },
    scoreSelections,
    level: booking.testResult?.level ?? '',
    subLevel: booking.testResult?.subLevel ?? '',
    speaking: booking.testResult?.speaking ?? '',
    lwr: booking.testResult?.lwr ?? '',
    path: booking.testResult?.path ?? 'Kiểm tra đầu vào Tiếng Anh',
    generalComment:
      booking.notes?.at(-1)?.text ||
      booking.msg ||
      (isStrong
        ? 'Học viên giao tiếp tự tin, có phản xạ nói tốt, phát âm khá chuẩn và tiếp thu nhanh các câu hỏi giao tiếp.'
        : 'Học viên hiểu được các câu hỏi cơ bản, cần rèn luyện thêm sự tự tin và phản xạ trả lời thành câu hoàn chỉnh.'),
    oldForm: {
      scoreSelections: oldScoreSelections,
      isSkipped: false,
      vocabLevel: isStrong ? 'rich' : 'basic',
      vocabRemembered: isStrong
        ? 'daily routine, classroom objects, family, hobbies'
        : 'colors, animals, numbers',
      vocabForgotten: isStrong
        ? 'past activities, comparative adjectives'
        : 'actions, prepositions, school subjects',
      grammarRemembered: isStrong
        ? 'Present simple, can/cannot, basic questions'
        : 'Present simple, plural nouns',
      grammarForgotten: isStrong
        ? 'Past simple irregular verbs, comparatives'
        : 'Question forms, word order',
      grammarErrors: isStrong
        ? ['missingS', 'subjectVerbAgreement']
        : ['wrongWordOrder', 'wrongStructure'],
      grammarDetail: isStrong
        ? 'Đôi lúc thiếu âm cuối và chia động từ chưa ổn định khi nói nhanh.'
        : 'Cần nhắc lại trật tự từ và cấu trúc câu hỏi đơn giản.',
      openQuestion: isStrong ? 'fluentExpanded' : 'needsSupport',
      pronunciationErrors: isStrong ? ['wrongStress'] : ['noEndingSound', 'wrongStress'],
      pronunciationDetail: isStrong
        ? 'Trọng âm câu cần tự nhiên hơn khi trả lời dài.'
        : 'Cần luyện âm cuối và trọng âm từ trong câu trả lời ngắn.',
      fluencyAnswers: {
        confidence: isStrong ? 'positive' : 'negative',
        smoothness: isStrong ? 'positive' : 'negative',
        reflex: numericScore >= 7 ? 'positive' : 'negative',
        naturalness: numericScore >= 7 ? 'positive' : 'negative',
      },
      generalComment: isStrong
        ? 'Học viên giao tiếp tự tin, có nền tảng tốt và nên tiếp tục luyện phát âm, độ lưu loát.'
        : 'Học viên hiểu câu hỏi đơn giản nhưng cần hỗ trợ để trả lời thành câu đầy đủ.',
    },
  }
}

export function hasAssessmentDraftContent(draft: AssessmentDraft) {
  return Boolean(
    (draft.scoreSelections && Object.keys(draft.scoreSelections).length >= 8 && Object.values(draft.scoreSelections).some((v) => typeof v === 'number')) ||
      (draft.feedbackAnswers && Object.keys(draft.feedbackAnswers).length > 0) ||
      (draft.weaknesses && draft.weaknesses.length > 0) ||
      draft.generalComment ||
      (draft.oldForm && (
        Object.keys(draft.oldForm.scoreSelections || {}).length ||
        draft.oldForm.generalComment ||
        draft.oldForm.vocabRemembered ||
        draft.oldForm.grammarDetail
      ))
  )
}
