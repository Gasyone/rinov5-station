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

export function buildSampleAssessmentDraft(booking: BookingTest): AssessmentDraft | null {
  const scoreSelections = score2025Samples[booking.id]
  const oldScoreSelections = oldScoreSamples[booking.id]
  if (!scoreSelections || !oldScoreSelections) return null

  return {
    evaluatorId: booking.teacher ?? '',
    testType: booking.id === 'E0005' ? 'flyers' : booking.id === 'E0002' ? 'preStarters' : 'starters',
    selectedTab: 'form2025',
    isSkipped2025: false,
    weaknesses:
      booking.id === 'E0002'
        ? ['missesKeywords', 'singleWords', 'hesitantSpeech']
        : ['incorrectPronunciation', 'incorrectIntonation', 'hesitantSpeech'],
    feedbackAnswers: {
      confidence: booking.id === 'E0002' ? 'negative' : 'positive',
      vocabulary: booking.id === 'E0002' ? 'negative' : 'positive',
      sentenceUse: booking.id === 'E0002' ? 'negative' : 'positive',
      intonation: 'negative',
      fluency: booking.id === 'E0005' ? 'positive' : 'negative',
      ideaExpression: booking.id === 'E0002' ? 'negative' : 'positive',
      wordRecognition: booking.id === 'E0005' ? 'positive' : 'negative',
    },
    scoreSelections,
    level: booking.testResult?.level ?? '',
    subLevel: booking.testResult?.subLevel ?? '',
    speaking: booking.testResult?.speaking ?? '',
    lwr: booking.testResult?.lwr ?? '',
    path: booking.testResult?.path ?? 'Kiểm tra đầu vào Tiếng Anh',
    oldForm: {
      scoreSelections: oldScoreSelections,
      isSkipped: false,
      vocabLevel: booking.id === 'E0002' ? 'basic' : 'rich',
      vocabRemembered:
        booking.id === 'E0002'
          ? 'colors, animals, numbers'
          : 'daily routine, classroom objects, family, hobbies',
      vocabForgotten:
        booking.id === 'E0002'
          ? 'actions, prepositions, school subjects'
          : 'past activities, comparative adjectives',
      grammarRemembered:
        booking.id === 'E0002'
          ? 'Present simple, plural nouns'
          : 'Present simple, can/cannot, basic questions',
      grammarForgotten:
        booking.id === 'E0002'
          ? 'Question forms, word order'
          : 'Past simple irregular verbs, comparatives',
      grammarErrors:
        booking.id === 'E0002'
          ? ['wrongWordOrder', 'wrongStructure']
          : ['missingS', 'subjectVerbAgreement'],
      grammarDetail:
        booking.id === 'E0002'
          ? 'Cần nhắc lại trật tự từ và cấu trúc câu hỏi đơn giản.'
          : 'Đôi lúc thiếu âm cuối và chia động từ chưa ổn định khi nói nhanh.',
      openQuestion: booking.id === 'E0002' ? 'needsSupport' : 'fluentExpanded',
      pronunciationErrors:
        booking.id === 'E0005' ? ['wrongStress'] : ['noEndingSound', 'wrongStress'],
      pronunciationDetail:
        booking.id === 'E0005'
          ? 'Trọng âm câu cần tự nhiên hơn khi trả lời dài.'
          : 'Cần luyện âm cuối và trọng âm từ trong câu trả lời ngắn.',
      fluencyAnswers: {
        confidence: booking.id === 'E0002' ? 'negative' : 'positive',
        smoothness: booking.id === 'E0002' ? 'negative' : 'positive',
        reflex: booking.id === 'E0005' ? 'positive' : 'negative',
        naturalness: booking.id === 'E0005' ? 'positive' : 'negative',
      },
      generalComment:
        booking.id === 'E0002'
          ? 'Học viên hiểu câu hỏi đơn giản nhưng cần hỗ trợ để trả lời thành câu đầy đủ.'
          : 'Học viên giao tiếp tự tin, có nền tảng tốt và nên tiếp tục luyện phát âm, độ lưu loát.',
    },
  }
}

export function hasAssessmentDraftContent(draft: AssessmentDraft) {
  return Boolean(
    Object.keys(draft.scoreSelections).length ||
      Object.keys(draft.feedbackAnswers).length ||
      draft.weaknesses.length ||
      Object.keys(draft.oldForm.scoreSelections).length ||
      draft.oldForm.generalComment ||
      draft.oldForm.vocabRemembered ||
      draft.oldForm.grammarDetail
  )
}
