export interface StudentFormState {
  homeworkApp: string
  homeworkBook: string
  absorption: number
  participation: number
  evaluation: number
  strength: string
  weakness: string
  otherNotes: string
  reminders: string[]
  otherReminder: string
  tone: string
  generatedFeedback: string
  isSent: boolean
  internalNote: string
  vocabulary: number
  grammar: number
  speaking: number
  pronunciation: number
  attitude: number
  vocabGoodNotes: string
  vocabImproveNotes: string
  grammarGoodNotes: string
  grammarImproveNotes: string
  speakingGoodNotes: string
  speakingImproveNotes: string
  pronGoodNotes: string
  pronImproveNotes: string
  aiUsesLeft?: number

  // 5 Bậc tư duy toán học:
  mathBasic?: number
  mathBasicStrength?: string
  mathBasicWeakness?: string

  mathLogic?: number
  mathLogicStrength?: string
  mathLogicWeakness?: string

  mathMath?: number
  mathMathStrength?: string
  mathMathWeakness?: string

  mathCreative?: number
  mathCreativeStrength?: string
  mathCreativeWeakness?: string

  mathCritical?: number
  mathCriticalStrength?: string
  mathCriticalWeakness?: string

  // Legacy fallback fields
  mathArithmetic?: number
  mathArithmeticStrength?: string
  mathArithmeticWeakness?: string

  mathSpatial?: number
  mathSpatialStrength?: string
  mathSpatialWeakness?: string

  mathModeling?: number
  mathModelingStrength?: string
  mathModelingWeakness?: string
}
