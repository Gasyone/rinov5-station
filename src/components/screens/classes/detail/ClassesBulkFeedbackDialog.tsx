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
  readOnly?: boolean
  initialStudentId?: string
  isTestSession?: boolean
}

interface StudentFormState {
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
  aiUsesLeft?: number
  
  // Cambridge fields
  vocabulary: number
  grammar: number
  speaking: number
  pronunciation: number
  attitude: number

  // Dynamic sub-notes
  vocabGoodNotes: string
  vocabImproveNotes: string
  grammarGoodNotes: string
  grammarImproveNotes: string
  speakingGoodNotes: string
  speakingImproveNotes: string
  pronGoodNotes: string
  pronImproveNotes: string
}



export function ClassesBulkFeedbackDialog({
  isOpen,
  onClose,
  students,
  onSave,
  sessionTopic = 'Phonics lab: Nguyên âm ngắn',
  classLevel = 'IELTS',
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
    return levelLower.includes('math') || levelLower.includes('toán') || topicLower.includes('math') || topicLower.includes('toán')
  }, [classLevel, sessionTopic])

  // Initialize draft form states for each student
  const initialFormStates = useMemo(() => {
    const states: Record<string, StudentFormState> = {}
    students.forEach(({ student, feedback }) => {
      const hasFeedback = !!feedback && feedback.trim() !== ''
      states[student.id] = {
        homeworkApp: hasFeedback ? 'Done' : '',
        homeworkBook: hasFeedback ? 'Done' : '',
        absorption: 4,
        participation: 4,
        evaluation: 4,
        strength: '',
        weakness: '',
        otherNotes: '',
        reminders: [],
        otherReminder: '',
        tone: 'friendly',
        generatedFeedback: feedback || '',
        isSent: hasFeedback,
        vocabulary: hasFeedback ? 4 : 4,
        grammar: hasFeedback ? 4 : 4,
        speaking: hasFeedback ? 4 : 4,
        pronunciation: hasFeedback ? 4 : 4,
        attitude: hasFeedback ? 4 : 4,
        internalNote: '',
        aiUsesLeft: 3,
        vocabGoodNotes: '',
        vocabImproveNotes: '',
        grammarGoodNotes: '',
        grammarImproveNotes: '',
        speakingGoodNotes: '',
        speakingImproveNotes: '',
        pronGoodNotes: '',
        pronImproveNotes: '',
      }
    })
    return states
  }, [students, isMath])

  const [formStates, setFormStates] = useState<Record<string, StudentFormState>>(initialFormStates)
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(initialStudentId || students[0]?.student.id || null)

  // Sync / Reset when student list, class, initialStudentId, or isOpen status changes
  const cacheKey = `${studentsKey}_${isMath}_${sessionTopic}_${initialStudentId}_${isOpen}`
  const [prevKey, setPrevKey] = useState(cacheKey)
  if (prevKey !== cacheKey) {
    setPrevKey(cacheKey)
    setFormStates(initialFormStates)
    setSelectedStudentId(initialStudentId || students[0]?.student.id || null)
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
          return sum + (s.evaluation || 0) + (s.attitude || 0)
        } else {
          return sum + (s.vocabulary || 0) + (s.grammar || 0) + (s.speaking || 0) + (s.pronunciation || 0) + (s.attitude || 0)
        }
      }, 0)
  }, [formStates, isMath])

  const handleUpdateField = (field: keyof StudentFormState, value: StudentFormState[keyof StudentFormState]) => {
    if (!selectedStudentId) return
    setFormStates((prev) => ({
      ...prev,
      [selectedStudentId]: {
        ...prev[selectedStudentId],
        [field]: value,
      },
    }))
  }



  // AI-inspired comment generator
  const handleGenerateFeedback = () => {
    if (!selectedStudentId || !selectedStudent || !currentFormState) return

    if (isMath) {
      const isFriendly = currentFormState.tone === 'friendly' || currentFormState.tone === 'Gần gũi, thân thiện' || !currentFormState.tone
      const RATING_MAP: Record<number, string> = {
        1: 'Yếu',
        2: 'Trung bình',
        3: 'Khá',
        4: 'Tốt',
        5: 'Tuyệt vời',
      }

      const absLabel = RATING_MAP[currentFormState.absorption || 4] || 'Tốt'
      const partLabel = RATING_MAP[currentFormState.participation || 4] || 'Tốt'
      const evalLabel = RATING_MAP[currentFormState.evaluation || 4] || 'Tốt'

      const welcomeText = isFriendly
        ? `- Hôm nay con đã tham gia rất hào hứng bài học môn Toán 📐\n- Khả năng tiếp thu: ${absLabel} | Tương tác trong lớp: ${partLabel} | Giải quyết vấn đề & trình bày: ${evalLabel}`
        : `- Học viên hoàn thành nội dung bài học môn Toán.\n- Đánh giá: Tiếp thu (${absLabel}), Tham gia hoạt động (${partLabel}), Giải quyết vấn đề (${evalLabel}).`

      const strengthText = currentFormState.strength
        ? `- Con hiểu và nắm vững cách trình bày dạng bài: ${currentFormState.strength} 🔍`
        : `- Con tiếp thu bài giảng nhanh và hoàn thành tốt các bài tập.`

      const weaknessText = currentFormState.weakness
        ? `- Con cần rèn luyện thêm dạng bài: ${currentFormState.weakness} 🎯`
        : ''

      const otherNotesText = currentFormState.otherNotes
        ? `- Ghi chú thêm: ${currentFormState.otherNotes}`
        : ''

      const reminderLines = [...(currentFormState.reminders || [])]
      if (currentFormState.otherReminder) {
        reminderLines.push(currentFormState.otherReminder)
      }
      const reminderText = reminderLines.length > 0
        ? `\n\n🔔 Nhắc nhở để buổi học đạt kết quả tốt hơn:\n${reminderLines.map((r) => `- ${r}`).join('\n')}`
        : ''

      const finalFeedback = `🤖 Tổng quan buổi học:
${welcomeText}

🏅 Điểm tốt & Năng lực:
${strengthText}
${weaknessText ? '\n' + weaknessText : ''}
${otherNotesText ? '\n' + otherNotesText : ''}${reminderText}`

      if ((currentFormState.aiUsesLeft ?? 3) > 0) {
        handleUpdateField('aiUsesLeft', (currentFormState.aiUsesLeft ?? 3) - 1)
      }

      handleUpdateField('generatedFeedback', finalFeedback)
      toast.success(`Đã tạo nhận xét tự động cho học viên ${selectedStudent.name}!`)
    } else {
      const isFriendly = currentFormState.tone === 'friendly'
      
      const introLine = isFriendly
        ? `- Luyện tập cấu trúc hỏi đáp: ${sessionTopic} 🧠`
        : `- Học viên đã hoàn thành nội dung bài học: ${sessionTopic}.`

      let hwSuccessBullet = ''
      let hwNeedsWorkBullet = ''
      const app = currentFormState.homeworkApp
      const book = currentFormState.homeworkBook

      if (isFriendly) {
        if (app === 'Done' && book === 'Done') {
          hwSuccessBullet = `- Con đã hoàn thành xuất sắc bài tập trên ứng dụng và sách Workbook – rất đáng khen! 🌟`
        } else if (app === 'No Homework' && book === 'No Homework') {
          // No homework
        } else {
          const appPart = app === 'Done' ? 'đã làm xong bài tập trên app 🌟' : app === 'Partly Done' ? 'hoàn thành một phần bài tập trên app 📝' : app === 'Not Yet' ? 'chưa làm bài tập trên app ❌' : 'không có bài tập app'
          const bookPart = book === 'Done' ? 'đã làm xong sách Workbook ⭐' : book === 'Partly Done' ? 'hoàn thành một phần sách Workbook 📝' : book === 'Not Yet' ? 'chưa làm sách Workbook ❌' : 'không có bài tập Workbook'
          
          if (app === 'Not Yet' || book === 'Not Yet' || app === 'Partly Done' || book === 'Partly Done') {
            hwNeedsWorkBullet = `- Về bài tập: Con ${appPart} và ${bookPart}. Con cố gắng hoàn thành đầy đủ hơn ở buổi học tới nhé! 🎯`
          } else {
            hwSuccessBullet = `- Về bài tập: Con ${appPart} và ${bookPart}.`
          }
        }
      } else {
        if (app === 'Done' && book === 'Done') {
          hwSuccessBullet = `- Học viên đã hoàn thành đầy đủ bài tập trên ứng dụng và sách bài tập (Workbook).`
        } else if (app === 'No Homework' && book === 'No Homework') {
          // No homework
        } else {
          const appPart = app === 'Done' ? 'Hoàn thành' : app === 'Partly Done' ? 'Hoàn thành một phần' : app === 'Not Yet' ? 'Chưa hoàn thành' : 'Không có'
          const bookPart = book === 'Done' ? 'Hoàn thành' : book === 'Partly Done' ? 'Hoàn thành một phần' : book === 'Not Yet' ? 'Chưa hoàn thành' : 'Không có'
          const statusStr = `- Tình hình làm bài tập: Ứng dụng (${appPart}), Sách Workbook (${bookPart}).`
          if (app === 'Not Yet' || book === 'Not Yet') {
            hwNeedsWorkBullet = statusStr
          } else {
            hwSuccessBullet = statusStr
          }
        }
      }

      const strengthsList: string[] = []
      const improvementsList: string[] = []

      // Vocabulary
      const vocVal = currentFormState.vocabulary || 4
      let vocText = isFriendly
        ? `- Con ghi nhớ tốt từ vựng về ngữ âm và bài học (${vocVal}/5) 🧠`
        : `- Khả năng ghi nhớ từ vựng đạt kết quả tốt (${vocVal}/5).`
      if (vocVal < 4) {
        vocText = isFriendly
          ? `- Con cần dành thêm thời gian ôn tập từ vựng để phản xạ nhanh hơn (${vocVal}/5) 🧠`
          : `- Cần củng cố thêm vốn từ vựng (${vocVal}/5).`
      }
      if (currentFormState.vocabGoodNotes) {
        vocText += `\n  + Điểm tốt: ${currentFormState.vocabGoodNotes}`
      }
      if (currentFormState.vocabImproveNotes) {
        vocText += `\n  + Cần lưu ý: ${currentFormState.vocabImproveNotes}`
      }
      if (vocVal >= 4) {
        strengthsList.push(vocText)
      } else {
        improvementsList.push(vocText)
      }

      // Grammar
      const graVal = currentFormState.grammar || 4
      let graText = isFriendly
        ? `- Con sử dụng tốt cấu trúc câu tương tác (${graVal}/5) 🎯`
        : `- Áp dụng cấu trúc ngữ pháp đạt yêu cầu (${graVal}/5).`
      if (graVal < 4) {
        graText = isFriendly
          ? `- Con chú ý hơn khi áp dụng cấu trúc ngữ pháp để tránh lỗi nhỏ (${graVal}/5) 🎯`
          : `- Cần luyện tập thêm các cấu trúc ngữ pháp đã học (${graVal}/5).`
      }
      if (currentFormState.grammarGoodNotes) {
        graText += `\n  + Điểm tốt: ${currentFormState.grammarGoodNotes}`
      }
      if (currentFormState.grammarImproveNotes) {
        graText += `\n  + Cần lưu ý: ${currentFormState.grammarImproveNotes}`
      }
      if (graVal >= 4) {
        strengthsList.push(graText)
      } else {
        improvementsList.push(graText)
      }

      // Speaking
      const speVal = currentFormState.speaking || 4
      let speText = isFriendly
        ? `- Kỹ năng nói trôi chảy, tự tin giao tiếp (${speVal}/5) ✨`
        : `- Kỹ năng nói và tương tác trong giờ học tốt (${speVal}/5).`
      if (speVal < 4) {
        speText = isFriendly
          ? `- Con cố gắng tự tin nói to và rõ ràng hơn nữa khi giao tiếp (${speVal}/5) ✨`
          : `- Cần chủ động tương tác nói nhiều hơn trong giờ học (${speVal}/5).`
      }
      if (currentFormState.speakingGoodNotes) {
        speText += `\n  + Điểm tốt: ${currentFormState.speakingGoodNotes}`
      }
      if (currentFormState.speakingImproveNotes) {
        speText += `\n  + Cần lưu ý: ${currentFormState.speakingImproveNotes}`
      }
      if (speVal >= 4) {
        strengthsList.push(speText)
      } else {
        improvementsList.push(speText)
      }

      // Pronunciation
      const proVal = currentFormState.pronunciation || 4
      let proText = isFriendly
        ? `- Phát âm chuẩn và rõ ràng các âm tiết (${proVal}/5) 🗣️`
        : `- Kỹ năng phát âm từ vựng tương đối chuẩn xác (${proVal}/5).`
      if (proVal < 4) {
        proText = isFriendly
          ? `- Con cần chú ý phát âm rõ các âm đuôi và ngữ điệu câu (${proVal}/5) 🗣️`
          : `- Cần chú ý luyện tập phát âm chuẩn xác hơn (${proVal}/5).`
      }
      if (currentFormState.pronGoodNotes) {
        proText += `\n  + Điểm tốt: ${currentFormState.pronGoodNotes}`
      }
      if (currentFormState.pronImproveNotes) {
        proText += `\n  + Cần lưu ý: ${currentFormState.pronImproveNotes}`
      }
      if (proVal >= 4) {
        strengthsList.push(proText)
      } else {
        improvementsList.push(proText)
      }

      // Attitude
      const attVal = currentFormState.attitude || 4
      if (attVal >= 4) {
        strengthsList.push(
          isFriendly
            ? `- Thái độ học tập tích cực, tập trung nghe giảng và hăng hái phát biểu (${attVal}/5) 🌟`
            : `- Thái độ học tập trong lớp tích cực, chủ động tương tác với giáo viên (${attVal}/5).`
        )
      } else {
        improvementsList.push(
          isFriendly
            ? `- Con cần tập trung hơn trong giờ học và hạn chế làm việc riêng (${attVal}/5) 🎯`
            : `- Cần nâng cao thái độ tự giác và sự tập trung trong giờ học (${attVal}/5).`
        )
      }

      const strengthBullets = [hwSuccessBullet, ...strengthsList].filter(Boolean).join('\n')
      const strengthSection = strengthBullets 
        ? `🏅 Thành tích nổi bật:\n${strengthBullets}`
        : '🏅 Thành tích nổi bật:\n- Học viên hoàn thành tốt các mục tiêu bài học.'

      const improvementBullets = [hwNeedsWorkBullet, ...improvementsList].filter(Boolean).join('\n')
      
      let otherNoteBullet = ''
      if (currentFormState.otherNotes) {
        otherNoteBullet = isFriendly 
          ? `- Ghi chú: ${currentFormState.otherNotes} 📝`
          : `- Ghi chú thêm: ${currentFormState.otherNotes}`
      }

      const improvementSection = [improvementBullets, otherNoteBullet].filter(Boolean).join('\n')
      const finalImprovementSection = improvementSection 
        ? `🌱 Mục tiêu cần cải thiện:\n${improvementSection}`
        : '🌱 Mục tiêu cần cải thiện:\n- Tiếp tục phát huy các kỹ năng hiện tại.'

      const reminderLines = [...currentFormState.reminders]
      if (currentFormState.otherReminder) {
        reminderLines.push(currentFormState.otherReminder)
      }
      const reminderText = reminderLines.length > 0
        ? `\n\n🔔 Nhắc nhở nhỏ xíu:\n${reminderLines.map((r) => `- ${r}`).join('\n')}`
        : ''

      const finalFeedback = `${introLine}

${strengthSection}

${finalImprovementSection}${reminderText}`

      handleUpdateField('generatedFeedback', finalFeedback)
      toast.success(`Đã tạo nhận xét tự động cho học viên ${selectedStudent.name}!`)
    }
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
            <div className="px-3 py-2 border-b text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
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
                        "h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border",
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
                                <span className="truncate text-[11px] text-muted-foreground font-normal">{np.vietnameseName}</span>
                              </div>
                            )
                          }
                          return <p className="truncate font-semibold leading-tight">{np.vietnameseName}</p>
                        })()}
                        <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{student.code}</p>
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
