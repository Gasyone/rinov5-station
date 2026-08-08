'use client'

import React, { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Clipboard } from 'lucide-react'
import type { RosterStudent, TestScoreData } from './classesDetailTypes'
import { getInitials, getAvatarColor } from './classesSessionDetailHelpers'
import { getStudentNameParts } from './classesDetailHelpers'

interface ClassesTestScoreDialogProps {
  isOpen: boolean
  onClose: () => void
  students: RosterStudent[]
  initialStudentId: string | null
  skill: string // e.g. 'Listening' | 'Reading' | 'Writing' | 'Speaking'
  scores: Record<string, Record<string, TestScoreData>> // studentId -> skill -> scoreData
  onSaveScore: (studentId: string, skill: string, scoreData: TestScoreData) => void
  classLevel?: string
}

interface SpeakingWritingRubric {
  vocabulary: number
  vocabCorrect: string
  vocabIncorrect: string
  grammar: number
  grammarCorrect: string
  grammarIncorrect: string
  pronunciation: number
  pronunciationCorrect: string
  pronunciationIncorrect: string
  fluency: number
  fluencyText: string
}


export function ClassesTestScoreDialog({
  isOpen,
  onClose,
  students,
  initialStudentId,
  skill,
  scores,
  onSaveScore,
}: ClassesTestScoreDialogProps) {
  const [prevInitialStudentId, setPrevInitialStudentId] = useState<string | null>(initialStudentId)
  const [activeStudentId, setActiveStudentId] = useState<string>(() => {
    return initialStudentId ?? (students.length > 0 ? students[0].id : '')
  })

  // Sync state when initialStudentId changes
  if (initialStudentId !== prevInitialStudentId) {
    setPrevInitialStudentId(initialStudentId)
    if (initialStudentId) {
      setActiveStudentId(initialStudentId)
    }
  }

  // Selected student
  const activeStudent = useMemo(() => {
    return students.find((s) => s.id === activeStudentId) ?? students[0]
  }, [students, activeStudentId])

  // Rubric Form State for subjective skills
  const [rubricForm, setRubricForm] = useState<SpeakingWritingRubric>({
    vocabulary: 0,
    vocabCorrect: '',
    vocabIncorrect: '',
    grammar: 0,
    grammarCorrect: '',
    grammarIncorrect: '',
    pronunciation: 0,
    pronunciationCorrect: '',
    pronunciationIncorrect: '',
    fluency: 0,
    fluencyText: '',
  })

  const [ktScore, setKtScore] = useState<number>(0)
  const [ktComment, setKtComment] = useState<string>('')

  // Synchronize form values on student/skill change using render-based transition
  const [prevKey, setPrevKey] = useState<string>('')
  const currentKey = `${activeStudentId}-${skill}`

  if (currentKey !== prevKey) {
    setPrevKey(currentKey)
    const studentScore = scores[activeStudentId]?.[skill]
    if (studentScore && studentScore.status === 'graded') {
      if (skill === 'KTĐK') {
        setKtScore(studentScore.score ?? 0)
        setKtComment(studentScore.objective?.comment ?? '')
      } else {
        setRubricForm({
          vocabulary: studentScore.rubric?.vocabulary ?? 0,
          vocabCorrect: studentScore.rubric?.vocabCorrect ?? '',
          vocabIncorrect: studentScore.rubric?.vocabIncorrect ?? '',
          grammar: studentScore.rubric?.grammar ?? 0,
          grammarCorrect: studentScore.rubric?.grammarCorrect ?? '',
          grammarIncorrect: studentScore.rubric?.grammarIncorrect ?? '',
          pronunciation: studentScore.rubric?.pronunciation ?? 0,
          pronunciationCorrect: studentScore.rubric?.pronunciationCorrect ?? '',
          pronunciationIncorrect: studentScore.rubric?.pronunciationIncorrect ?? '',
          fluency: studentScore.rubric?.fluency ?? 0,
          fluencyText: studentScore.rubric?.fluencyText ?? '',
        })
      }
    } else {
      // Initialize empty
      if (skill === 'KTĐK') {
        setKtScore(0)
        setKtComment('')
      } else {
        setRubricForm({
          vocabulary: 0,
          vocabCorrect: '',
          vocabIncorrect: '',
          grammar: 0,
          grammarCorrect: '',
          grammarIncorrect: '',
          pronunciation: 0,
          pronunciationCorrect: '',
          pronunciationIncorrect: '',
          fluency: 0,
          fluencyText: '',
        })
      }
    }
  }

  // Calculated Score
  const calculatedScore = useMemo(() => {
    const { vocabulary, grammar, pronunciation, fluency } = rubricForm
    if (vocabulary === 0 || grammar === 0 || pronunciation === 0 || fluency === 0) {
      return null
    }
    // Formula: (sum of 4 criteria) / 2
    const sum = vocabulary + grammar + pronunciation + fluency
    return sum / 2
  }, [rubricForm])

  const activeScore = useMemo(() => {
    if (skill === 'KTĐK') return ktScore
    return calculatedScore
  }, [skill, ktScore, calculatedScore])

  const showSuggestions = useMemo(() => {
    return rubricForm.fluency > 0
  }, [rubricForm.fluency])

  // Copy Fluency Suggestions
  const positiveFluencySuggestions = [
    { text: 'một cách tự tin;', meaning: 'confident' },
    { text: 'trôi chảy;', meaning: 'fluent' },
    { text: 'phản xạ tốt;', meaning: 'well responsive' },
    { text: 'lưu loát và mạch lạc;', meaning: 'fluent and coherent' },
    { text: 'linh hoạt và tự nhiên;', meaning: 'flexible and natural' },
  ]

  const negativeFluencySuggestions = [
    { text: 'còn ngập ngừng, ấp úng;', meaning: 'hesitant, faltering' },
    { text: 'thiếu mạch lạc;', meaning: 'incoherent' },
    { text: 'chưa lưu loát;', meaning: 'inarticulate' },
    { text: 'chưa tự tin;', meaning: 'unconfident' },
    { text: 'phản xạ chưa nhanh;', meaning: 'poorly responsive' },
  ]

  const handleCopySuggestion = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`Đã sao chép: "${text}"`)

    // Also auto-append to the textbox
    setRubricForm((prev) => {
      const current = prev.fluencyText.trim()
      if (current.includes(text)) return prev
      const separator = current === '' || current.endsWith(';') ? ' ' : '; '
      return {
        ...prev,
        fluencyText: current + separator + text,
      }
    })
  }

  // Handle Save (UPDATE)
  const handleUpdate = () => {
    if (!activeStudent) return

    if (skill === 'KTĐK') {
      if (ktScore < 0 || ktScore > 10) {
        toast.error('Điểm số phải từ 0 đến 10.')
        return
      }
      onSaveScore(activeStudent.id, skill, {
        score: ktScore,
        status: 'graded',
        objective: {
          correctAnswers: 0,
          totalQuestions: 10,
          comment: ktComment,
        }
      })
    } else {
      const { vocabulary, grammar, pronunciation, fluency } = rubricForm
      if (vocabulary === 0 || grammar === 0 || pronunciation === 0 || fluency === 0) {
        toast.error('Vui lòng chọn đầy đủ thang điểm đánh giá từ 1 đến 5 cho các tiêu chí.')
        return
      }

      onSaveScore(activeStudent.id, skill, {
        score: calculatedScore,
        status: 'graded',
        rubric: rubricForm,
      })
    }

    toast.success(`Đã cập nhật nhận xét ${skill} cho học viên ${activeStudent.name}`)

    // Auto-select next student in the list for faster workflow
    const currentIndex = students.findIndex((s) => s.id === activeStudent.id)
    if (currentIndex >= 0 && currentIndex < students.length - 1) {
      setActiveStudentId(students[currentIndex + 1].id)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="grid h-[90vh] max-h-[900px] grid-rows-[auto_minmax(0,1fr)] gap-0 overflow-hidden p-0 sm:max-w-[95vw] lg:max-w-[1380px] rounded-2xl border bg-white dark:bg-zinc-950 shadow-xl">
        {/* Dialog Header */}
        <DialogHeader className="shrink-0 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between bg-white dark:bg-zinc-950">
          <DialogTitle className="text-base font-bold text-foreground">
            {skill} Score
          </DialogTitle>
        </DialogHeader>

        {/* Main Content Split: Left Sidebar (Student List) / Right Form */}
        <div className="grid grid-cols-[280px_1fr] h-full min-h-0 divide-x divide-zinc-200 dark:divide-zinc-800 overflow-hidden">
          
          {/* LEFT SIDEBAR: Student List */}
          <aside className="flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 overflow-y-auto">
            <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-900/60 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-[10px] uppercase font-bold text-muted-foreground tracking-wider z-10">
              <span>Student</span>
              <span>{skill} Score</span>
            </div>
            <div className="flex-1 divide-y divide-zinc-100 dark:divide-zinc-800/50">
              {students.map((student) => {
                const sScore = scores[student.id]?.[skill]
                const scoreDisplay = sScore?.status === 'graded' && sScore.score !== null 
                  ? `${sScore.score}/10` 
                  : '- -'
                const isActive = student.id === activeStudentId

                return (
                  <button
                    key={student.id}
                    onClick={() => setActiveStudentId(student.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 flex items-center justify-between transition-colors border-l-4",
                      isActive 
                        ? "bg-sky-50/70 border-l-sky-500 dark:bg-sky-950/20 text-sky-950 dark:text-sky-400" 
                        : "border-l-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-800/40 text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0",
                        getAvatarColor(student.id)
                      )}>
                        {getInitials(student.name)}
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
                          return <p className="font-semibold text-xs truncate leading-snug">{np.vietnameseName}</p>
                        })()}
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{student.code}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "text-xs font-bold shrink-0 font-mono",
                      sScore?.status === 'graded' ? "text-sky-600 dark:text-sky-400" : "text-zinc-400"
                    )}>
                      {scoreDisplay}
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>

          {/* RIGHT PANEL: Form */}
          <main className="flex flex-col h-full overflow-hidden">
            {/* Warning Banner */}
            <div className="shrink-0 bg-amber-50 dark:bg-amber-950/20 border-b border-amber-100 dark:border-amber-900/40 px-5 py-2.5 flex flex-wrap gap-3 items-center justify-between text-[11px]">
              <span className="text-amber-800 dark:text-amber-400 font-semibold flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                Importance: ONLY USE SEMICOLON ; to separate words, phrases or sentences
              </span>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span>How to use:</span>
                <span className="hover:underline cursor-pointer inline-flex items-center gap-1">
                  🇻🇳 Vietnamese
                </span>
                <span>|</span>
                <span className="hover:underline cursor-pointer inline-flex items-center gap-1">
                  🇬🇧 English
                </span>
              </div>
            </div>

            {/* Scrollable Form Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {skill === 'KTĐK' ? (
                <div className="space-y-4 max-w-md animate-fade-in">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      Điểm kiểm tra định kỳ (KTĐK Score)<span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      step={0.5}
                      value={ktScore}
                      onChange={(e) => setKtScore(parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-zinc-900 dark:border-zinc-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
                      Nhận xét bài kiểm tra (Remarks)
                    </label>
                    <Textarea
                      value={ktComment}
                      onChange={(e) => setKtComment(e.target.value)}
                      placeholder="Nhập nhận xét về bài kiểm tra định kỳ của học viên..."
                      className="min-h-24 text-xs resize-none rounded-lg focus-visible:ring-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-6 max-w-4xl">
                  {/* vocabulary */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Vocabulary<span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label key={val} className="flex items-center gap-1 text-xs font-medium cursor-pointer select-none">
                            <input
                              type="radio"
                              name="vocab-rating"
                              checked={rubricForm.vocabulary === val}
                              onChange={() => setRubricForm((p) => ({ ...p, vocabulary: val }))}
                              className="accent-primary h-3.5 w-3.5 cursor-pointer"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">3-5 words students used correctly: <span className="text-destructive">*</span></span>
                        <Textarea
                          value={rubricForm.vocabCorrect}
                          onChange={(e) => setRubricForm((p) => ({ ...p, vocabCorrect: e.target.value }))}
                          placeholder="Words are separated by semicolons ;"
                          className="min-h-16 text-xs resize-none rounded-lg border-sky-200 dark:border-sky-900 focus-visible:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Word(s) students could not used correctly (5 words maximum):</span>
                        <Textarea
                          value={rubricForm.vocabIncorrect}
                          onChange={(e) => setRubricForm((p) => ({ ...p, vocabIncorrect: e.target.value }))}
                          placeholder="Words are separated by semicolons ;"
                          className="min-h-16 text-xs resize-none rounded-lg border-orange-200 dark:border-orange-900 focus-visible:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* grammar */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Grammar<span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label key={val} className="flex items-center gap-1 text-xs font-medium cursor-pointer select-none">
                            <input
                              type="radio"
                              name="grammar-rating"
                              checked={rubricForm.grammar === val}
                              onChange={() => setRubricForm((p) => ({ ...p, grammar: val }))}
                              className="accent-primary h-3.5 w-3.5 cursor-pointer"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Structure(s) students used correctly:</span>
                        <Textarea
                          value={rubricForm.grammarCorrect}
                          onChange={(e) => setRubricForm((p) => ({ ...p, grammarCorrect: e.target.value }))}
                          placeholder="Structures are separated by semicolons ;"
                          className="min-h-16 text-xs resize-none rounded-lg border-sky-200 dark:border-sky-900 focus-visible:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Structure(s) students could not used correctly:</span>
                        <Textarea
                          value={rubricForm.grammarIncorrect}
                          onChange={(e) => setRubricForm((p) => ({ ...p, grammarIncorrect: e.target.value }))}
                          placeholder="Structures are separated by semicolons ;"
                          className="min-h-16 text-xs resize-none rounded-lg border-orange-200 dark:border-orange-900 focus-visible:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* pronunciation */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Pronunciation<span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label key={val} className="flex items-center gap-1 text-xs font-medium cursor-pointer select-none">
                            <input
                              type="radio"
                              name="pronunciation-rating"
                              checked={rubricForm.pronunciation === val}
                              onChange={() => setRubricForm((p) => ({ ...p, pronunciation: val }))}
                              className="accent-primary h-3.5 w-3.5 cursor-pointer"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Word(s) students could pronounce (5 words maximum):</span>
                        <Textarea
                          value={rubricForm.pronunciationCorrect}
                          onChange={(e) => setRubricForm((p) => ({ ...p, pronunciationCorrect: e.target.value }))}
                          placeholder="Words are separated by semicolons ;"
                          className="min-h-16 text-xs resize-none rounded-lg border-sky-200 dark:border-sky-900 focus-visible:ring-sky-500"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase">Word(s) students could not pronounce correctly (5 words maximum):</span>
                        <Textarea
                          value={rubricForm.pronunciationIncorrect}
                          onChange={(e) => setRubricForm((p) => ({ ...p, pronunciationIncorrect: e.target.value }))}
                          placeholder="Words are separated by semicolons ;"
                          className="min-h-16 text-xs resize-none rounded-lg border-orange-200 dark:border-orange-900 focus-visible:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* fluency and interaction */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b pb-2 dark:border-zinc-800">
                      <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                        Fluency and interaction<span className="text-destructive">*</span>
                      </label>
                      <div className="flex items-center gap-4">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <label key={val} className="flex items-center gap-1 text-xs font-medium cursor-pointer select-none">
                            <input
                              type="radio"
                              name="fluency-rating"
                              checked={rubricForm.fluency === val}
                              onChange={() => setRubricForm((p) => ({ ...p, fluency: val }))}
                              className="accent-primary h-3.5 w-3.5 cursor-pointer"
                            />
                            <span>{val}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {/* Fluency describe input */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-[#f43f5e] uppercase">
                          Words best describe student&apos;s fluency and interaction: *
                        </span>
                        <p className="text-[9px] text-muted-foreground italic -mt-1">
                          Click icons <Clipboard className="inline h-3 w-3 mx-0.5" /> to copy the Vietnamese words and paste on the textbox:
                        </p>
                        <Textarea
                          value={rubricForm.fluencyText}
                          onChange={(e) => setRubricForm((p) => ({ ...p, fluencyText: e.target.value }))}
                          placeholder="Words are separated by semicolons ;"
                          className="min-h-24 text-xs resize-none rounded-lg border-sky-200 dark:border-sky-900 focus-visible:ring-sky-500"
                        />
                      </div>
                      
                      {/* Suggestions list */}
                      {showSuggestions && (
                        <div className="space-y-1.5 p-1 animate-fade-in">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block mb-1">
                            Suggestions (Based on rating)
                          </span>
                          <div className="space-y-1.5">
                            {(rubricForm.fluency >= 4 ? positiveFluencySuggestions : negativeFluencySuggestions).map((item, index) => (
                              <div 
                                key={index}
                                onClick={() => handleCopySuggestion(item.text)}
                                className={cn(
                                  "flex items-center gap-2 text-[10px] px-2 py-1 rounded cursor-pointer transition-colors border select-none",
                                  rubricForm.fluency >= 4 
                                    ? "bg-sky-50/50 hover:bg-sky-100/50 border-sky-100 text-sky-800 dark:bg-sky-950/20 dark:border-sky-900/40 dark:text-sky-300"
                                    : "bg-orange-50/50 hover:bg-orange-100/50 border-orange-100 text-orange-800 dark:bg-orange-950/20 dark:border-orange-900/40 dark:text-orange-300"
                                )}
                              >
                                <Clipboard className="h-3.5 w-3.5 shrink-0" />
                                <span className="font-semibold">{item.text}</span>
                                <span className="text-muted-foreground font-light font-mono">meaning &quot;{item.meaning}&quot;</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sticky Form Footer */}
            <div className="shrink-0 sticky bottom-0 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-1 text-xs">
                <span className="font-semibold text-muted-foreground">{skill} Score:</span>
                <span className={cn(
                  "font-bold text-sm font-mono",
                  activeScore !== null ? "text-primary text-base" : "text-zinc-400"
                )}>
                  {activeScore !== null ? `${activeScore}/10` : '--'}
                </span>
              </div>
              <Button
                type="button"
                onClick={handleUpdate}
                className="bg-[#e11d48] hover:bg-[#be123c] dark:bg-rose-600 dark:hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider px-6 h-9 rounded-lg"
              >
                UPDATE
              </Button>
            </div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  )
}
