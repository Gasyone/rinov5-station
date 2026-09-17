'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  Sparkles,
  Check,
  Zap,
  Send,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { RosterStudent } from '../classesDetailTypes'
import {
  type StudentLiveLog,
  type LiveConclusionStudentEval,
  type LiveQuickTag,
  MATH_LIVE_TAGS,
  ENGLISH_LIVE_TAGS,
} from './liveTeachingTypes'
import { LiveConclusionStudentCol } from './LiveConclusionStudentCol'
import { LiveConclusionSkillsCard } from './LiveConclusionSkillsCard'

interface LiveTeachingConclusionViewProps {
  students: RosterStudent[]
  studentLogs: Record<string, StudentLiveLog>
  isMath: boolean
  classNameTitle: string
  sessionTopic: string
  onBackToTeaching: () => void
  onCompleteAndSave: (evaluations: Record<string, string>) => void
}

export function LiveTeachingConclusionView({
  students,
  studentLogs,
  isMath,
  classNameTitle,
  sessionTopic,
  onBackToTeaching,
  onCompleteAndSave,
}: LiveTeachingConclusionViewProps) {
  // Build exact feedback text grounded in individual skill notes, live tags, BTVN, reminders
  const buildFeedbackText = (student: RosterStudent, evalData: LiveConclusionStudentEval) => {
    const log = studentLogs[student.id]
    const tagsLookup = isMath ? MATH_LIVE_TAGS : ENGLISH_LIVE_TAGS
    const appliedTags = (log?.tags || []).map((tId) => tagsLookup.find((t) => t.id === tId)).filter(Boolean)

    const formatHw = (hw: string) => {
      if (hw === 'Done') return 'Hoàn thành'
      if (hw === 'Partly Done') return '1 phần'
      if (hw === 'Not Yet') return 'Chưa làm'
      if (hw === 'No Homework') return 'Không có bài tập'
      return hw || 'Hoàn thành'
    }

    const lines: string[] = []
    lines.push(`- Bài học: ${sessionTopic || (isMath ? 'Toán tư duy — Phép tách số & Bảng 100' : 'English — Classroom Objects & Story Time')}`)
    lines.push(`- Tình hình BTVN: Ứng dụng (${formatHw(evalData.homeworkApp)}), Sách (${formatHw(evalData.homeworkBook)}).`)

    // Extract individual skill good notes
    const skillGoodEntries = Object.entries(evalData.skillGoodNotes || {}).filter(([, v]) => Boolean(v?.trim()))
    const skillImproveEntries = Object.entries(evalData.skillImproveNotes || {}).filter(([, v]) => Boolean(v?.trim()))

    // Positive section
    lines.push(`\n🏆 Điểm nổi bật trong giờ:`)
    if (skillGoodEntries.length > 0) {
      skillGoodEntries.forEach(([key, note]) => {
        const skillName = key === 'vocabulary' ? 'Từ vựng' : key === 'grammar' ? 'Ngữ pháp' : key === 'speaking' ? 'Giao tiếp' : key === 'pronunciation' ? 'Phát âm' : key === 'mathBasic' ? 'Tư duy cơ bản' : key === 'mathLogic' ? 'Tư duy logic' : key === 'mathMath' ? 'Tư duy Toán học' : key === 'mathCreative' ? 'Sáng tạo' : key === 'mathCritical' ? 'Phản biện' : key
        const formattedNote = note.replace(/;\s*/g, ', ')
        lines.push(`- ${skillName}: ${formattedNote}`)
      })
    } else if (evalData.strength && evalData.strength.trim()) {
      lines.push(`- ${evalData.strength.trim()}`)
    } else {
      const positiveTags = appliedTags.filter(
        (t) => t && !t.id.includes('careless') && !t.id.includes('miss')
      )
      if (positiveTags.length > 0) {
        positiveTags.forEach((t) => lines.push(`- ${t?.feedbackMapping?.noteText || t?.label}`))
      } else {
        if (isMath) {
          lines.push(`- Nắm được cách xác định vị trí số và thực hiện phép tính (${evalData.mathMath || 4}/5★) 🔢`)
          lines.push(`- Hăng hái tương tác và có thái độ học tập tích cực (${evalData.attitude || 4}/5★) 🌟`)
        } else {
          lines.push(`- Ghi nhớ tốt từ vựng bài học và có phản xạ nói khá (${evalData.vocabulary || 4}/5★) ⚡`)
          lines.push(`- Tự tin tương tác và hợp tác cùng thầy cô (${evalData.attitude || 4}/5★) 🌟`)
        }
      }
    }

    // Improvements section
    lines.push(`\n🌱 Điểm cần rèn luyện thêm:`)
    if (skillImproveEntries.length > 0) {
      skillImproveEntries.forEach(([key, note]) => {
        const skillName = key === 'vocabulary' ? 'Từ vựng' : key === 'grammar' ? 'Ngữ pháp' : key === 'speaking' ? 'Giao tiếp' : key === 'pronunciation' ? 'Phát âm' : key === 'mathBasic' ? 'Tư duy cơ bản' : key === 'mathLogic' ? 'Tư duy logic' : key === 'mathMath' ? 'Tư duy Toán học' : key === 'mathCreative' ? 'Sáng tạo' : key === 'mathCritical' ? 'Phản biện' : key
        const formattedNote = note.replace(/;\s*/g, ', ')
        lines.push(`- ${skillName}: ${formattedNote}`)
      })
    } else if (evalData.weakness && evalData.weakness.trim()) {
      lines.push(`- ${evalData.weakness.trim()}`)
    } else {
      const improveTags = appliedTags.filter(
        (t) => t && (t.id.includes('careless') || t.id.includes('miss'))
      )
      if (improveTags.length > 0) {
        improveTags.forEach((t) => lines.push(`- ${t?.feedbackMapping?.noteText || t?.label}`))
      } else if (evalData.homeworkBook === 'Not Yet' || evalData.homeworkBook === 'Chưa làm') {
        lines.push(`- Con chú ý hoàn thành bài tập về nhà trong sách trước buổi học tiếp theo! ⏰`)
      } else {
        lines.push(`- Tiếp tục duy trì tinh thần tự giác và phản xạ tích cực ở các buổi tới.`)
      }
    }

    // Reminders section
    if (evalData.reminders && evalData.reminders.length > 0) {
      lines.push(`\n⚠️ Nhắc nhở nề nếp & thiết bị:`)
      evalData.reminders.forEach((r) => {
        lines.push(`- ${r}`)
      })
    }
    if (evalData.otherReminder && evalData.otherReminder.trim()) {
      lines.push(`- Lưu ý khác: ${evalData.otherReminder.trim()}`)
    }

    if (log?.quickNote) {
      lines.push(`\n📌 Tốc ký giáo viên: ${log.quickNote}`)
    }

    return lines.join('\n')
  }

  // Initialize evaluations pre-populated with live logs & pre-generated feedback
  const initialEvals = useMemo(() => {
    const map: Record<string, LiveConclusionStudentEval> = {}
    const tagsLookup = isMath ? MATH_LIVE_TAGS : ENGLISH_LIVE_TAGS

    students.forEach((student) => {
      const log = studentLogs[student.id]
      const appliedTags = (log?.tags || []).map((tId) => tagsLookup.find((t) => t.id === tId)).filter(Boolean)

      const hasSplitTag = appliedTags.some((t) => t?.id === 'tag_math_split')
      const hasGridTag = appliedTags.some((t) => t?.id === 'tag_math_grid')
      const hasDominoTag = appliedTags.some((t) => t?.id === 'tag_math_domino')
      const hasPatternTag = appliedTags.some((t) => t?.id === 'tag_logic_pattern')
      const hasReasoningTag = appliedTags.some((t) => t?.id === 'tag_logic_reasoning')
      const hasActiveTag = appliedTags.some((t) => t?.id.includes('active'))
      const hasCarelessTag = appliedTags.some((t) => t?.id.includes('careless'))
      const hasMissingHwTag = appliedTags.some((t) => t?.id.includes('missing'))

      // English tags
      const hasPronGood = appliedTags.some((t) => t?.id === 'tag_eng_pron_good')
      const hasPronMiss = appliedTags.some((t) => t?.id === 'tag_eng_pron_miss')
      const hasVocabQuick = appliedTags.some((t) => t?.id === 'tag_eng_vocab_quick')
      const hasSentenceFull = appliedTags.some((t) => t?.id === 'tag_eng_sentence_full')

      // Prepopulate skill good notes and improve notes from live logs
      const initialSkillGoodNotes: Record<string, string> = {}
      const initialSkillImproveNotes: Record<string, string> = {}

      if (hasVocabQuick) initialSkillGoodNotes.vocabulary = 'Ghi nhớ từ vựng nhanh'
      if (hasSentenceFull) initialSkillGoodNotes.grammar = 'Sử dụng mẫu câu đầy đủ'
      if (hasPronGood) initialSkillGoodNotes.pronunciation = 'Phát âm chuẩn và rõ ràng'
      if (hasPronMiss) initialSkillImproveNotes.pronunciation = 'Cần luyện thêm âm đuôi'
      if (hasActiveTag) initialSkillGoodNotes.speaking = 'Tự tin phát biểu, tương tác tốt'

      if (hasSplitTag) initialSkillGoodNotes.mathMath = 'Thực hiện phép tách số tốt'
      if (hasGridTag) initialSkillGoodNotes.mathBasic = 'Xác định nhanh vị trí hàng cột'
      if (hasDominoTag) initialSkillGoodNotes.mathCreative = 'Sáng tạo ghép số domino'
      if (hasPatternTag) initialSkillGoodNotes.mathLogic = 'Suy luận quy luật tốt'
      if (hasReasoningTag) initialSkillGoodNotes.mathCritical = 'Lập luận giải thích tự tin'
      if (hasCarelessTag) initialSkillImproveNotes.mathBasic = 'Cần tính toán nháp cẩn thận hơn'

      const initialReminders: string[] = []
      if (hasCarelessTag) {
        initialReminders.push("Pay more attention and don't do your own work in class")
      }

      const evalDraft: LiveConclusionStudentEval = {
        studentId: student.id,
        attitude: hasActiveTag ? 5 : 4,
        homeworkApp: hasMissingHwTag ? 'Not Yet' : 'Done',
        homeworkBook: hasMissingHwTag ? 'Not Yet' : 'Done',
        // Math ratings
        mathBasic: hasGridTag ? 5 : hasCarelessTag ? 3 : 4,
        mathLogic: hasPatternTag ? 5 : 4,
        mathMath: hasSplitTag ? 5 : 4,
        mathCreative: hasDominoTag ? 5 : 4,
        mathCritical: hasReasoningTag ? 5 : 4,
        // English ratings
        vocabulary: hasVocabQuick ? 5 : 4,
        grammar: hasSentenceFull ? 5 : 4,
        speaking: hasActiveTag ? 5 : 4,
        pronunciation: hasPronGood ? 5 : hasPronMiss ? 3 : 4,
        skillGoodNotes: initialSkillGoodNotes,
        skillImproveNotes: initialSkillImproveNotes,
        reminders: initialReminders,
        otherReminder: '',
        feedbackText: '',
        isGenerated: false,
      }

      // Automatically pre-populate feedback matching student's logs
      const prefilledText = buildFeedbackText(student, evalDraft)
      evalDraft.feedbackText = prefilledText
      evalDraft.isGenerated = true

      map[student.id] = evalDraft
    })
    return map
  }, [students, studentLogs, isMath, sessionTopic])

  const [evaluations, setEvaluations] = useState<Record<string, LiveConclusionStudentEval>>(initialEvals)
  const [manualEditedStudents, setManualEditedStudents] = useState<Record<string, boolean>>({})

  // Update a field for a specific student
  const handleUpdateStudentField = <K extends keyof LiveConclusionStudentEval>(
    studentId: string,
    field: K,
    value: LiveConclusionStudentEval[K]
  ) => {
    if (field === 'feedbackText') {
      setManualEditedStudents((prev) => ({ ...prev, [studentId]: true }))
    }

    setEvaluations((prev) => {
      const current = prev[studentId]
      if (!current) return prev

      const updated = {
        ...current,
        [field]: value,
      }

      // Automatically sync feedbackText in real time when tags/ratings change,
      // as long as the student's text hasn't been manually edited in the textarea and not sent yet
      if (field !== 'feedbackText' && !current.isSent && !manualEditedStudents[studentId]) {
        const student = students.find((s) => s.id === studentId)
        if (student) {
          updated.feedbackText = buildFeedbackText(student, updated)
          updated.isGenerated = true
        }
      }

      return {
        ...prev,
        [studentId]: updated,
      }
    })
  }

  // Handle Generate AI for single student
  const handleGenerateStudentFeedback = (student: RosterStudent) => {
    setManualEditedStudents((prev) => ({ ...prev, [student.id]: false }))
    const item = evaluations[student.id]
    if (!item) return
    const text = buildFeedbackText(student, item)
    setEvaluations((prev) => ({
      ...prev,
      [student.id]: {
        ...prev[student.id],
        feedbackText: text,
        isGenerated: true,
      },
    }))
    toast.success(`Đã tạo nhận xét AI cho học viên ${student.name}!`)
  }

  // Handle Save and Send Feedback for Single Student
  const handleSendIndividualFeedback = (student: RosterStudent) => {
    const item = evaluations[student.id]
    const fallbackEval: LiveConclusionStudentEval = item || {
      studentId: student.id,
      attitude: 4,
      homeworkApp: 'Done',
      homeworkBook: 'Done',
      feedbackText: '',
      isGenerated: false,
    }
    const textToSend = item?.feedbackText?.trim() || buildFeedbackText(student, fallbackEval)
    setEvaluations((prev) => ({
      ...prev,
      [student.id]: {
        ...prev[student.id],
        feedbackText: textToSend,
        isGenerated: true,
        isSent: true,
      },
    }))
    toast.success(`Đã lưu và gửi nhận xét cho học viên ${student.name} thành công!`)
  }

  // 1-Click Fast Standard Assessment (Đánh giá nhanh cả lớp đạt chuẩn)
  const handleQuickStandardizeAll = () => {
    setEvaluations((prev) => {
      const next = { ...prev }
      students.forEach((student) => {
        const curr = next[student.id]
        if (curr) {
          next[student.id] = {
            ...curr,
            attitude: curr.attitude || 5,
            homeworkApp: curr.homeworkApp || 'Done',
            homeworkBook: curr.homeworkBook || 'Done',
            mathBasic: curr.mathBasic || 4,
            mathLogic: curr.mathLogic || 4,
            mathMath: curr.mathMath || 5,
            mathCreative: curr.mathCreative || 4,
            mathCritical: curr.mathCritical || 4,
            vocabulary: curr.vocabulary || 5,
            grammar: curr.grammar || 4,
            speaking: curr.speaking || 5,
            pronunciation: curr.pronunciation || 4,
          }
        }
      })
      return next
    })
    toast.success('Đã áp dụng đánh giá đạt chuẩn nhanh cho toàn bộ học sinh!')
  }

  // Handle Batch Generate AI for ALL students
  const handleBatchGenerateAll = () => {
    setEvaluations((prev) => {
      const next = { ...prev }
      students.forEach((student) => {
        const item = next[student.id]
        if (item) {
          const text = buildFeedbackText(student, item)
          next[student.id] = {
            ...item,
            feedbackText: text,
            isGenerated: true,
          }
        }
      })
      return next
    })
    toast.success(`Đã tự động tạo nhận xét AI cho toàn bộ ${students.length} học viên trong lớp!`)
  }

  // Handle Finish and Save All
  const handleCompleteAll = () => {
    const resultMap: Record<string, string> = {}
    setEvaluations((prev) => {
      const next = { ...prev }
      students.forEach((s) => {
        const item = next[s.id]
        const fallbackEval: LiveConclusionStudentEval = item || {
          studentId: s.id,
          attitude: 4,
          homeworkApp: 'Done',
          homeworkBook: 'Done',
          feedbackText: '',
          isGenerated: false,
        }
        const text =
          item && item.feedbackText.trim() !== '' ? item.feedbackText : buildFeedbackText(s, fallbackEval)
        resultMap[s.id] = text
        next[s.id] = {
          ...item,
          feedbackText: text,
          isGenerated: true,
          isSent: true,
        }
      })
      return next
    })
    toast.success('Đã lưu toàn bộ đánh giá và gửi nhận xét thành công!')
    onCompleteAndSave(resultMap)
  }

  const completedCount = Object.values(evaluations).filter((e) => e.isSent || e.isGenerated || e.feedbackText.trim() !== '').length

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-50 dark:bg-zinc-950 overflow-hidden select-none animate-in fade-in duration-200">
      {/* ── Top Bar: Navigation, Subject Badge, Batch Actions ── */}
      <header className="h-14 border-b bg-white dark:bg-zinc-900 px-4 flex items-center justify-between gap-3 shrink-0 shadow-2xs z-20">
        <div className="flex items-center gap-3 min-w-0">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBackToTeaching}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Quay lại bài giảng</span>
          </Button>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-700" />

          <div className="flex items-center gap-2 min-w-0">
            <Badge
              className={cn(
                'text-xs font-bold px-2 py-0.5 rounded-md border-none shrink-0',
                isMath ? 'bg-blue-600 text-white' : 'bg-purple-600 text-white'
              )}
            >
              {isMath ? 'Toán tư duy' : 'Tiếng Anh Cambridge'}
            </Badge>
            <div className="truncate text-xs">
              <span className="font-bold text-foreground truncate">{classNameTitle}</span>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-muted-foreground font-medium truncate">Tổng kết ca dạy & Đánh giá cả lớp</span>
            </div>
          </div>
        </div>

        {/* Action Controls on the right */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Progress Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border text-xs font-mono">
            <span className="text-muted-foreground">Tiến độ:</span>
            <span className="font-bold text-primary">
              {completedCount}/{students.length}
            </span>
          </div>

          {/* Button: Đánh giá chuẩn nhanh */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleQuickStandardizeAll}
            className="h-8 gap-1.5 text-xs font-semibold rounded-lg border-amber-300 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 cursor-pointer shadow-2xs"
            title="Tự động áp dụng đánh giá đạt chuẩn (4-5★) cho các bạn chưa chấm"
          >
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">Đánh giá chuẩn nhanh</span>
          </Button>

          {/* Button: Tạo nhận xét AI cả lớp */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleBatchGenerateAll}
            className="h-8 gap-1.5 text-xs font-bold rounded-lg border-primary/40 text-primary hover:bg-primary/10 cursor-pointer shadow-2xs"
            title="Sinh nhận xét AI cho tất cả học viên cùng lúc"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Tạo nhận xét AI cả lớp</span>
          </Button>

          {/* Button: Hoàn thành & Gửi tất cả */}
          <Button
            type="button"
            size="sm"
            onClick={handleCompleteAll}
            className="h-8 px-4 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 shadow-sm cursor-pointer"
          >
            <Check className="h-3.5 w-3.5 stroke-[3px]" />
            <span>Hoàn thành & Gửi tất cả ({completedCount}/{students.length})</span>
          </Button>
        </div>
      </header>

      {/* ── Main Content: 3 Balanced Columns (Học viên & Nề nếp / Đánh giá kỹ năng Mở rộng / Nhận xét PH) ── */}
      <div className="flex-1 overflow-auto custom-scrollbar p-3 sm:p-4">
        <div className="w-full bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex flex-col">
          {/* Table Header Row: 3 columns (Col 1: 3/12, Col 2: 5/12, Col 3: 4/12) */}
          <div className="grid grid-cols-12 gap-3.5 px-4 py-3 bg-zinc-100/80 dark:bg-zinc-800/80 border-b text-[11px] font-extrabold uppercase tracking-wider text-muted-foreground items-center shrink-0">
            <div className="col-span-12 xl:col-span-3">Học viên, Thái độ & Nền nếp (BTVN)</div>
            <div className="col-span-12 xl:col-span-5">
              {isMath ? 'Đánh giá 5 bậc tư duy & Ghi chú riêng từng bậc' : 'Đánh giá 4 kỹ năng & Ghi chú riêng từng kỹ năng'}
            </div>
            <div className="col-span-12 xl:col-span-4">Nhận xét chi tiết gửi phụ huynh</div>
          </div>

          {/* Table Body: 100% Students visible and interactive on ONE page */}
          <div className="divide-y divide-zinc-200/80 dark:divide-zinc-800">
            {students.map((student, index) => {
              const itemEval = evaluations[student.id] || ({} as LiveConclusionStudentEval)
              const log = studentLogs[student.id]
              const tagsLookup = isMath ? MATH_LIVE_TAGS : ENGLISH_LIVE_TAGS
              const appliedTags = (log?.tags || []).map((tId) => tagsLookup.find((t) => t.id === tId)).filter(Boolean)
              const isDone = Boolean(itemEval.isGenerated || itemEval.feedbackText)

              return (
                <div
                  key={student.id}
                  className={cn(
                    'grid grid-cols-12 gap-3.5 p-3.5 items-start transition-colors',
                    index % 2 === 0 ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-50/50 dark:bg-zinc-900/40',
                    'hover:bg-primary/[0.02]'
                  )}
                >
                  {/* Cột 1: Học viên, Thái độ học tập, BTVN App & Sách, Nền nếp & Nhắc nhở (Col 3/12) */}
                  <div className="col-span-12 xl:col-span-3">
                    <LiveConclusionStudentCol
                      student={student}
                      evalData={itemEval}
                      appliedTags={appliedTags as LiveQuickTag[]}
                      liveNote={log?.quickNote}
                      isDone={isDone}
                      onUpdateField={handleUpdateStudentField}
                    />
                  </div>

                  {/* Cột 2: ĐÁNH GIÁ KỸ NĂNG & GHI CHÚ RIÊNG TỪNG KỸ NĂNG - MỞ RỘNG (Col 5/12) */}
                  <div className="col-span-12 xl:col-span-5">
                    <LiveConclusionSkillsCard
                      studentId={student.id}
                      evalData={itemEval}
                      isMath={isMath}
                      onUpdateField={handleUpdateStudentField}
                    />
                  </div>

                  {/* Cột 3: Nhận xét AI & Ô soạn thảo trực tiếp gửi phụ huynh (Col 4/12) */}
                  <div className="col-span-12 xl:col-span-4 space-y-1.5">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase truncate">
                          Nhận xét gửi PH:
                        </span>
                        {itemEval.isSent ? (
                          <Badge className="text-[9px] px-1.5 py-0 bg-emerald-600 text-white border-none shrink-0 shadow-2xs">
                            Đã gửi PH
                          </Badge>
                        ) : itemEval.isGenerated ? (
                          <Badge variant="outline" className="text-[9px] px-1 py-0 text-emerald-600 border-emerald-300 shrink-0">
                            Đã tạo AI
                          </Badge>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          onClick={() => handleGenerateStudentFeedback(student)}
                          className="h-6 gap-1 text-[10px] font-bold text-primary hover:bg-primary/10 rounded-md px-1.5 cursor-pointer"
                          title="Tạo nhận xét AI riêng cho học sinh này"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>{itemEval.feedbackText ? 'Tạo lại AI' : 'Tạo AI'}</span>
                        </Button>

                        <Button
                          type="button"
                          size="xs"
                          onClick={() => handleSendIndividualFeedback(student)}
                          className={cn(
                            'h-6 gap-1 text-[10px] font-bold rounded-md px-2 cursor-pointer transition-all shadow-2xs',
                            itemEval.isSent
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          )}
                          title="Lưu và gửi nhận xét cho riêng học sinh này"
                        >
                          {itemEval.isSent ? (
                            <>
                              <Check className="h-3 w-3 stroke-[3px]" />
                              <span>Đã gửi</span>
                            </>
                          ) : (
                            <>
                              <Send className="h-2.5 w-2.5" />
                              <span>Lưu & Gửi</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <Textarea
                      value={itemEval.feedbackText}
                      onChange={(e) => handleUpdateStudentField(student.id, 'feedbackText', e.target.value)}
                      placeholder="Bấm nút 'Tạo nhận xét AI' hoặc gõ trực tiếp nhận xét tại đây..."
                      className="min-h-[160px] max-h-[250px] text-xs font-sans leading-relaxed rounded-xl p-2.5 border-zinc-200 dark:border-zinc-800 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
