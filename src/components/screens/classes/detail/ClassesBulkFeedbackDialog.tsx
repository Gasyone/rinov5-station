'use client'

import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Check, Sparkles, Star } from 'lucide-react'
import type { RosterStudent } from './classesDetailTypes'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { ClassesBulkFeedbackCambridgeForm } from './ClassesBulkFeedbackCambridgeForm'
import { ClassesBulkFeedbackMathTestForm } from './ClassesBulkFeedbackMathTestForm'
import { ClassesBulkFeedbackMathForm } from './ClassesBulkFeedbackMathForm'
import { getStudentNameParts } from './classesDetailHelpers'

interface StudentFeedback {
  student: RosterStudent
  feedback: string
}

interface ClassesBulkFeedbackDialogProps {
  isOpen: boolean
  onClose: () => void
  students: StudentFeedback[]
  onSave: (feedbackMap: Record<string, string>) => void
  sessionTopic?: string
  classLevel?: string
  className?: string
  classSyllabus?: string
  classCode?: string
  readOnly?: boolean
  initialStudentId?: string
  isTestSession?: boolean
}

import type { StudentFormState } from './classesBulkFeedbackTypes'
import { generateAIFeedback } from './classesFeedbackGenerator'
import { deriveMathInitialRatings, stableHash } from './classesSessionDetailHelpers'

export type { StudentFormState }



export function ClassesBulkFeedbackDialog({
  isOpen,
  onClose,
  students,
  onSave,
  sessionTopic = 'Phonics lab: Nguyên âm ngắn',
  classLevel = 'IELTS',
  className = '',
  classSyllabus = '',
  classCode = '',
  readOnly = false,
  initialStudentId,
  isTestSession = false,
}: ClassesBulkFeedbackDialogProps) {
  const studentsKey = useMemo(
    () => students.map(({ student }) => student.id).join(','),
    [students]
  )

  const isMath = useMemo(() => {
    const levelLower = classLevel?.toLowerCase() || ''
    const topicLower = sessionTopic?.toLowerCase() || ''
    const nameLower = className?.toLowerCase() || ''
    const syllabusLower = classSyllabus?.toLowerCase() || ''
    const codeLower = classCode?.toLowerCase() || ''
    return (
      levelLower.includes('math') ||
      levelLower.includes('toán') ||
      levelLower.includes('toan') ||
      topicLower.includes('math') ||
      topicLower.includes('toán') ||
      topicLower.includes('toan') ||
      nameLower.includes('math') ||
      nameLower.includes('toán') ||
      nameLower.includes('toan') ||
      syllabusLower.includes('math') ||
      syllabusLower.includes('toán') ||
      syllabusLower.includes('toan') ||
      codeLower.includes('math') ||
      codeLower.includes('toan')
    )
  }, [classLevel, sessionTopic, className, classSyllabus, classCode])

  // Initialize draft form states for each student
  const initialFormStates = useMemo(() => {
    const states: Record<string, StudentFormState> = {}
    students.forEach(({ student, feedback }) => {
      const hasFeedback = !!feedback && feedback.trim() !== ''
      const hashVal = stableHash(student.id + (sessionTopic || ''))
      const mathRatings = isMath ? deriveMathInitialRatings(hasFeedback, hashVal) : null

      states[student.id] = {
        homeworkApp: isMath
          ? (mathRatings?.homeworkApp || '')
          : (hasFeedback ? 'Done' : ''),
        homeworkBook: isMath
          ? (mathRatings?.homeworkBook || '')
          : (hasFeedback ? 'Done' : ''),
        absorption: 4,
        participation: 4,
        evaluation: isMath ? (mathRatings?.mathBasic || 3) : 4,
        strength: '',
        weakness: '',
        otherNotes: '',
        reminders: isMath ? ['Vào lớp đúng giờ (tự động cập nhật)'] : [],
        otherReminder: '',
        tone: 'friendly',
        generatedFeedback: feedback || '',
        isSent: hasFeedback,
        vocabulary: hasFeedback ? 4 : 4,
        grammar: hasFeedback ? 4 : 4,
        speaking: hasFeedback ? 4 : 4,
        pronunciation: hasFeedback ? 4 : 4,
        attitude: isMath ? (mathRatings?.attitude || 3) : (hasFeedback ? 4 : 4),
        internalNote: '',
        aiUsesLeft: 2,
        vocabGoodNotes: '',
        vocabImproveNotes: '',
        grammarGoodNotes: '',
        grammarImproveNotes: '',
        speakingGoodNotes: '',
        speakingImproveNotes: '',
        pronGoodNotes: '',
        pronImproveNotes: '',
        mathBasic: mathRatings ? mathRatings.mathBasic : undefined,
        mathBasicStrength: mathRatings ? mathRatings.mathBasicStrength : '',
        mathBasicWeakness: mathRatings ? mathRatings.mathBasicWeakness : '',
        mathLogic: mathRatings ? mathRatings.mathLogic : undefined,
        mathLogicStrength: mathRatings ? mathRatings.mathLogicStrength : '',
        mathLogicWeakness: mathRatings ? mathRatings.mathLogicWeakness : '',
        mathMath: mathRatings ? mathRatings.mathMath : undefined,
        mathMathStrength: mathRatings ? mathRatings.mathMathStrength : '',
        mathMathWeakness: mathRatings ? mathRatings.mathMathWeakness : '',
        mathCreative: mathRatings ? mathRatings.mathCreative : undefined,
        mathCreativeStrength: mathRatings ? mathRatings.mathCreativeStrength : '',
        mathCreativeWeakness: mathRatings ? mathRatings.mathCreativeWeakness : '',
        mathCritical: mathRatings ? mathRatings.mathCritical : undefined,
        mathCriticalStrength: mathRatings ? mathRatings.mathCriticalStrength : '',
        mathCriticalWeakness: mathRatings ? mathRatings.mathCriticalWeakness : '',
        mathArithmetic: undefined,
        mathArithmeticStrength: '',
        mathArithmeticWeakness: '',
        mathSpatial: undefined,
        mathSpatialStrength: '',
        mathSpatialWeakness: '',
        mathModeling: undefined,
        mathModelingStrength: '',
        mathModelingWeakness: '',
      }
    })
    return states
  }, [students, isMath, sessionTopic])

  const [formStates, setFormStates] = useState<Record<string, StudentFormState>>(initialFormStates)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialStudentId || students[0]?.student.id || null)

  // Validation errors map: studentId -> fieldName -> errorMessage
  const [validationErrors, setValidationErrors] = useState<Record<string, Record<string, string>>>({})

  const currentErrors = useMemo(() => {
    return selectedStudentId ? validationErrors[selectedStudentId] || {} : {}
  }, [validationErrors, selectedStudentId])

  // Sync / Reset when student list, class, initialStudentId, or isOpen status changes
  const cacheKey = `${studentsKey}_${isMath}_${sessionTopic}_${initialStudentId}_${isOpen}`
  const [prevKey, setPrevKey] = useState(cacheKey)
  if (prevKey !== cacheKey) {
    setPrevKey(cacheKey)
    setFormStates(initialFormStates)
    setSelectedStudentId(initialStudentId || students[0]?.student.id || null)
    setValidationErrors({})
  }

  const selectedStudent = useMemo(() => {
    return students.find((s) => s.student.id === selectedStudentId)?.student || null
  }, [students, selectedStudentId])

  const currentFormState = selectedStudentId ? formStates[selectedStudentId] : null

  // Calculate statistics
  const completedCount = useMemo(() => {
    return Object.values(formStates).filter((s) => s.isSent).length
  }, [formStates])

  const totalCount = students.length

  const totalStars = useMemo(() => {
    return Object.values(formStates)
      .filter((s) => s.isSent)
      .reduce((sum, s) => {
        if (isMath) {
          return (
            sum +
            (s.mathBasic || 0) +
            (s.mathLogic || 0) +
            (s.mathMath || s.mathArithmetic || 0) +
            (s.mathCreative || 0) +
            (s.mathCritical || s.evaluation || 0) +
            (s.attitude || 0)
          )
        } else {
          return sum + (s.vocabulary || 0) + (s.grammar || 0) + (s.speaking || 0) + (s.pronunciation || 0) + (s.attitude || 0)
        }
      }, 0)
  }, [formStates, isMath])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleUpdateField = (field: any, value: any) => {
    if (!selectedStudentId) return
    setFormStates((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...prev[selectedStudentId],
        [field]: value,
      },
    }))

    // Clear validation error when user fills/changes the field
    setValidationErrors((prev) => {
      if (!prev[selectedStudentId] || !prev[selectedStudentId][field]) return prev
      const updated = { ...prev[selectedStudentId] }
      delete updated[field]
      return {
        ...prev,
        [selectedStudentId]: updated,
      }
    })
  }

  // AI comment generator with validation for mandatory starred fields
  const handleGenerateFeedback = () => {
    if (!selectedStudentId || !selectedStudent || !currentFormState) return

    if (isMath) {
      const newErrors: Record<string, string> = {}

      if (!currentFormState.homeworkApp) {
        newErrors.homeworkApp = 'Vui lòng chọn tình trạng bài tập trên ứng dụng (*)'
      }
      if (!currentFormState.homeworkBook) {
        newErrors.homeworkBook = 'Vui lòng chọn tình trạng bài tập trong sách (*)'
      }
      if (currentFormState.mathBasic === undefined) {
        newErrors.mathBasic = 'Vui lòng chọn mức đánh giá cho Tư duy cơ bản (*)'
      }
      if (currentFormState.mathLogic === undefined) {
        newErrors.mathLogic = 'Vui lòng chọn mức đánh giá cho Tư duy logic (*)'
      }
      if (currentFormState.mathMath === undefined && currentFormState.mathArithmetic === undefined) {
        newErrors.mathMath = 'Vui lòng chọn mức đánh giá cho Tư duy Toán học (*)'
      }
      if (currentFormState.mathCreative === undefined) {
        newErrors.mathCreative = 'Vui lòng chọn mức đánh giá cho Tư duy sáng tạo (*)'
      }
      if (currentFormState.mathCritical === undefined && currentFormState.evaluation === undefined) {
        newErrors.mathCritical = 'Vui lòng chọn mức đánh giá cho Tư duy phản biện & GQVĐ (*)'
      }

      if (Object.keys(newErrors).length > 0) {
        setValidationErrors((prev) => ({
          ...prev,
          [selectedStudentId]: newErrors,
        }))
        toast.error('Vui lòng hoàn thành các mục có dấu sao (*) bắt buộc trước khi tạo nhận xét!')
        return
      }

      // Clear validation errors for this student
      setValidationErrors((prev) => ({
        ...prev,
        [selectedStudentId]: {},
      }))
    }

    const finalFeedback = generateAIFeedback(currentFormState, {
      isMath,
      sessionTopic,
      classLevel,
    })

    if ((currentFormState.aiUsesLeft ?? 2) > 0) {
      handleUpdateField('aiUsesLeft', (currentFormState.aiUsesLeft ?? 2) - 1)
    }

    handleUpdateField('generatedFeedback', finalFeedback)
    toast.success(`Đã tạo nhận xét tự động cho học viên ${selectedStudent.name}!`)
  }

  const handleSendFeedback = () => {
    if (!selectedStudentId || !currentFormState) return
    if (!currentFormState.generatedFeedback.trim()) {
      toast.error('Nhận xét chưa được tạo hoặc chỉnh sửa!')
      return
    }
    handleUpdateField('isSent', true)
    toast.success('Gửi nhận xét thành công!')
  }

  const handleClose = () => {
    const feedbackMap: Record<string, string> = {}
    students.forEach(({ student }) => {
      const state = formStates[student.id]
      if (state && (state.isSent || state.generatedFeedback.trim() !== '')) {
        feedbackMap[student.id] = state.generatedFeedback
      }
    })
    onSave(feedbackMap)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="flex flex-col h-[90vh] max-h-[900px] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] bg-background border rounded-2xl shadow-2xl">
        {/* Header section with Stats */}
        <DialogHeader className="px-5 py-3 border-b shrink-0 bg-background flex flex-row items-center justify-between">
          <div className="space-y-1">
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary animate-pulse" />
              Nhận xét buổi học
            </DialogTitle>
            <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5 bg-muted/60 px-2 py-0.5 rounded-lg border">
                Đã hoàn thành: <strong className="text-foreground">{completedCount}</strong> / {totalCount}
              </span>
              {!(isMath && isTestSession) && (
                <span className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-lg border border-amber-200/50">
                  Tổng điểm đánh giá: <strong className="font-bold">{totalStars}</strong> <Star className="h-3 w-3 fill-amber-400 text-amber-400 shrink-0" />
                </span>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Dialog Split View Body */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Left Student List Sidebar */}
          <aside className="w-[280px] border-r dark:border-zinc-800 flex flex-col shrink-0 bg-zinc-50/50 dark:bg-zinc-950/20">
            <div className="px-3 py-2 border-b text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Học sinh ({totalCount})
            </div>
            <div className="flex-1 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
              {students.map(({ student }) => {
                const isSelected = student.id === selectedStudentId
                const state = formStates[student.id]
                const initials = student.name.split(' ').filter(Boolean).slice(-2).map((n) => n[0]).join('').toUpperCase()

                return (
                  <button
                    key={student.id}
                    onClick={() => setSelectedStudentId(student.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg text-left transition-all border text-xs cursor-pointer group",
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/20 font-bold"
                        : "hover:bg-muted/80 text-foreground border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border",
                        isSelected
                          ? "bg-primary/20 border-primary/20 text-primary"
                          : "bg-muted border-transparent text-muted-foreground group-hover:bg-background"
                      )}>
                        {initials}
                      </div>
                      <div className="min-w-0">
                        {(() => {
                          const np = getStudentNameParts(student)
                          if (np.hasEnglishName) {
                            return (
                              <div className="flex flex-col min-w-0 leading-tight">
                                <span className="truncate font-bold text-xs">{np.englishName}</span>
                                <span className="truncate text-xs text-muted-foreground font-normal">{np.vietnameseName}</span>
                              </div>
                            )
                          }
                          return <p className="truncate font-semibold leading-tight">{np.vietnameseName}</p>
                        })()}
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">{student.code}</p>
                      </div>
                    </div>
                    {state?.isSent && (
                      <span className="h-5 w-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm border border-emerald-400">
                        <Check className="h-3 w-3 stroke-[3px]" />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </aside>

          {/* Right Form Container */}
          <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-background custom-scrollbar">
            {selectedStudent && currentFormState ? (
              isMath && isTestSession ? (
                <ClassesBulkFeedbackMathTestForm
                  formState={currentFormState}
                  onUpdateField={handleUpdateField}
                  onGenerateFeedback={handleGenerateFeedback}
                  onSendFeedback={handleSendFeedback}
                  studentName={selectedStudent.name}
                  studentCode={selectedStudent.code}
                  classLevel={classLevel}
                  sessionTopic={sessionTopic}
                  readOnly={readOnly}
                  errors={currentErrors}
                />
              ) : isMath ? (
                <ClassesBulkFeedbackMathForm
                  formState={currentFormState}
                  onUpdateField={handleUpdateField}
                  onGenerateFeedback={handleGenerateFeedback}
                  onSendFeedback={handleSendFeedback}
                  studentName={selectedStudent.name}
                  studentCode={selectedStudent.code}
                  classLevel={classLevel}
                  sessionTopic={sessionTopic}
                  readOnly={readOnly}
                  errors={currentErrors}
                />
              ) : (
                <ClassesBulkFeedbackCambridgeForm
                  formState={currentFormState}
                  onUpdateField={handleUpdateField}
                  onGenerateFeedback={handleGenerateFeedback}
                  onSendFeedback={handleSendFeedback}
                  studentName={selectedStudent.name}
                  studentCode={selectedStudent.code}
                  readOnly={readOnly}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground italic text-xs">
                Vui lòng chọn học sinh ở danh sách bên trái để nhận xét.
              </div>
            )}
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
