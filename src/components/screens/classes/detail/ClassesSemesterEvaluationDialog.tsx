'use client'

import React, { useState, useMemo } from 'react'
import { Check, CheckCircle2, Table, PenSquare } from 'lucide-react'
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
import { useUIStore } from '@/stores/useUIStore'
import type { RosterStudent } from './classesDetailTypes'
import { getInitials } from './classesSessionDetailHelpers'
import { getStudentNameParts } from './classesDetailHelpers'
import { ClassesSemesterEvaluationTable } from './ClassesSemesterEvaluationTable'
import {
  type SemesterStudentEval,
  EMPTY_EVAL,
} from './classesSemesterEvaluationHelpers'
import {
  SEMESTER_EVAL_I18N,
  type EvaluationLang,
} from './classesSemesterEvaluationI18n'

export type { SemesterStudentEval } from './classesSemesterEvaluationHelpers'

function CustomRadio({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex items-center gap-1.5 text-left transition-all cursor-pointer font-medium hover:text-foreground/80 select-none animate-fade-in py-0.5"
    >
      <span className={cn(
        "h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all shadow-2xs bg-background",
        checked ? "border-zinc-900 dark:border-zinc-100" : "border-zinc-300 dark:border-zinc-600"
      )}>
        {checked && <div className="h-1.5 w-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100" />}
      </span>
      <span className={cn(checked ? "text-foreground font-bold" : "text-muted-foreground", "text-[11.5px] leading-tight")}>
        {label}
      </span>
    </button>
  )
}

function SectionHeader({
  title,
  ratingValue,
  onRatingChange,
}: {
  title: string
  ratingValue: number
  onRatingChange: (val: number) => void
}) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-[#e0f2fe]/60 dark:bg-sky-950/20 rounded-md shrink-0">
      <span className="text-xs font-bold text-sky-950 dark:text-sky-400 uppercase tracking-wide">{title}</span>
      <div className="flex items-center gap-2.5">
        {[1, 2, 3, 4, 5].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => onRatingChange(val)}
            className="flex items-center gap-1 text-xs text-sky-955 dark:text-sky-400 cursor-pointer select-none font-bold"
          >
            <span className={cn(
              "h-3.5 w-3.5 rounded-full border flex items-center justify-center shrink-0 bg-background transition-all",
              ratingValue === val ? "border-sky-950 dark:border-sky-400" : "border-zinc-300 dark:border-zinc-600"
            )}>
              {ratingValue === val && <div className="h-1.5 w-1.5 rounded-full bg-sky-955 dark:bg-sky-400" />}
            </span>
            <span>{val}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

interface ClassesSemesterEvaluationDialogProps {
  isOpen: boolean
  onClose: () => void
  students: RosterStudent[]
  fullRoster?: RosterStudent[]
  evalMap: Record<string, SemesterStudentEval>
  onSaveEval: (studentId: string, evaluation: SemesterStudentEval) => void
  sessionTopic?: string
}

export function ClassesSemesterEvaluationDialog({
  isOpen,
  onClose,
  students,
  fullRoster = [],
  evalMap,
  onSaveEval,
  sessionTopic = 'Semester Evaluation',
}: ClassesSemesterEvaluationDialogProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(students[0]?.id || null)
  const [viewMode, setViewMode] = useState<'table' | 'form'>('table')
  const [viewAllAttended, setViewAllAttended] = useState(false)
  const globalLocale = useUIStore((s) => s.locale)
  const lang: EvaluationLang = globalLocale === 'en' ? 'en' : 'vi'
  const t = SEMESTER_EVAL_I18N[lang]

  const displayedStudents = useMemo(() => {
    if (viewAllAttended && fullRoster && fullRoster.length > 0) {
      return fullRoster
    }
    return students
  }, [viewAllAttended, students, fullRoster])

  const selectedStudent = useMemo(() => {
    return displayedStudents.find((s) => s.id === selectedStudentId) || null
  }, [displayedStudents, selectedStudentId])

  const currentEval = useMemo(() => {
    if (!selectedStudentId) return EMPTY_EVAL
    return evalMap[selectedStudentId] || EMPTY_EVAL
  }, [selectedStudentId, evalMap])

  const handleUpdateField = <K extends keyof SemesterStudentEval>(field: K, value: SemesterStudentEval[K]) => {
    if (!selectedStudentId) return
    onSaveEval(selectedStudentId, {
      ...currentEval,
      [field]: value,
    })
  }

  const handleUpdate = () => {
    if (!selectedStudentId || !selectedStudent) return
    onSaveEval(selectedStudentId, {
      ...currentEval,
      isSubmitted: true,
    })
    toast.success(t.updatedSuccessToast(selectedStudent.name))
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent className="flex flex-col h-[92vh] max-h-[920px] gap-0 overflow-hidden p-0 sm:max-w-[92vw] md:max-w-[1000px] lg:max-w-[1080px] xl:max-w-[1120px] bg-background border rounded-2xl shadow-2xl">
        <DialogHeader className="px-4 py-2 border-b shrink-0 flex flex-row items-center justify-between gap-3 bg-background">
          <div className="flex items-center gap-2 min-w-0">
            <DialogTitle className="text-sm font-bold text-foreground truncate">
              {t.dialogTitle}
            </DialogTitle>
            <span className="text-xs text-muted-foreground truncate hidden sm:inline">· {t.sessionPrefix}: {sessionTopic}</span>
          </div>
          <div className="flex items-center gap-2.5 pr-8 shrink-0">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={viewAllAttended}
                onChange={(e) => setViewAllAttended(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-zinc-300 text-primary focus:ring-primary cursor-pointer bg-white dark:bg-zinc-900"
              />
              <span className="hidden md:inline">{t.viewAllAttended}</span>
            </label>
            <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border">
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setViewMode('table')}
                className={cn(
                  "h-6 px-2 text-xs font-bold gap-1 rounded-md transition-all cursor-pointer",
                  viewMode === 'table'
                    ? "text-primary bg-background shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Table className="h-3 w-3" />
                {t.tableMode}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => setViewMode('form')}
                className={cn(
                  "h-6 px-2 text-xs font-bold gap-1 rounded-md transition-all cursor-pointer",
                  viewMode === 'form'
                    ? "text-primary bg-background shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <PenSquare className="h-3 w-3" />
                {t.formMode}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 flex min-h-0 overflow-hidden">
          {viewMode === 'table' ? (
            <ClassesSemesterEvaluationTable
              displayedStudents={displayedStudents}
              evalMap={evalMap}
              onEditStudent={(id) => {
                setSelectedStudentId(id)
                setViewMode('form')
              }}
              lang={lang}
            />
          ) : (
            <>
              {/* Left Student List Sidebar */}
              <aside className="w-[240px] border-r dark:border-zinc-800 flex flex-col shrink-0 bg-zinc-50/50 dark:bg-zinc-950/20">
                <div className="px-3 py-1.5 border-b text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t.rosterHeader} ({displayedStudents.length})
                </div>
                <div className="flex-1 overflow-y-auto p-1 space-y-0.5 custom-scrollbar bg-white dark:bg-zinc-950">
                  {displayedStudents.map((student) => {
                    const isSelected = student.id === selectedStudentId
                    const isSaved = evalMap[student.id]?.isSubmitted
                    const initials = getInitials(student.name)

                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedStudentId(student.id)}
                        className={cn(
                          "w-full flex items-center justify-between p-1.5 px-2 rounded-lg text-left transition-all border text-xs cursor-pointer group",
                          isSelected
                            ? "bg-primary/10 text-primary border-primary/20 font-bold"
                            : "hover:bg-muted/80 text-foreground border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={cn(
                            "h-6.5 w-6.5 rounded-full flex items-center justify-center text-[10.5px] font-bold shrink-0 border",
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
                                    <span className="truncate font-bold text-[11.5px]">{np.englishName}</span>
                                    <span className="truncate text-[10.5px] text-muted-foreground font-normal">{np.vietnameseName}</span>
                                  </div>
                                )
                              }
                              return <p className="truncate font-semibold text-xs leading-tight">{np.vietnameseName}</p>
                            })()}
                            <p className="text-xs text-muted-foreground font-mono leading-none mt-0.5">{student.code}</p>
                          </div>
                        </div>
                        {isSaved && (
                          <span className="h-4.5 w-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-2xs border border-emerald-400">
                            <Check className="h-2.5 w-2.5 stroke-[3px]" />
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </aside>

              {/* Right panel: Evaluation form */}
              <main className="flex-1 overflow-y-auto p-3 sm:p-4 bg-white dark:bg-zinc-950 min-w-0">
                {selectedStudent ? (
                  <div className="space-y-3 max-w-[900px] mx-auto pb-4">
                    {/* Header Banner */}
                    <div className="flex items-center justify-between pb-1.5 shrink-0 border-b">
                      <div>
                        <h3 className="text-sm font-bold text-foreground">
                          {t.evalForStudent}: <span className="text-primary">{selectedStudent.name}</span>
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">{t.studentCode}: {selectedStudent.code}</p>
                      </div>
                      {currentEval.isSubmitted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shadow-2xs">
                          <Check className="h-3 w-3 stroke-[2.5px]" />
                          {t.evalCompletedBadge}
                        </span>
                      )}
                    </div>

                    {/* Section 1: Ý THỨC HỌC TẬP */}
                    <div className="space-y-1.5">
                      <SectionHeader
                        title={t.sectionAttitude}
                        ratingValue={currentEval.conductRating}
                        onRatingChange={(val) => handleUpdateField('conductRating', val)}
                      />

                      <div className="space-y-1 pt-1">
                        {/* Attendance options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductAttendance === 'full'}
                            onChange={() => handleUpdateField('conductAttendance', 'full')}
                            label={t.attFull}
                          />
                          <CustomRadio
                            checked={currentEval.conductAttendance === 'not_full'}
                            onChange={() => handleUpdateField('conductAttendance', 'not_full')}
                            label={t.attNotFull}
                          />
                        </div>

                        {/* Punctuality options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductPunctual === 'on_time'}
                            onChange={() => handleUpdateField('conductPunctual', 'on_time')}
                            label={t.attPunctual}
                          />
                          <CustomRadio
                            checked={currentEval.conductPunctual === 'late'}
                            onChange={() => handleUpdateField('conductPunctual', 'late')}
                            label={t.attLate}
                          />
                        </div>

                        {/* Homework options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductHw === 'done'}
                            onChange={() => handleUpdateField('conductHw', 'done')}
                            label={t.attHwDone}
                          />
                          <CustomRadio
                            checked={currentEval.conductHw === 'not_done'}
                            onChange={() => handleUpdateField('conductHw', 'not_done')}
                            label={t.attHwNotDone}
                          />
                        </div>

                        {/* Focus options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductFocus === 'focus'}
                            onChange={() => handleUpdateField('conductFocus', 'focus')}
                            label={t.attFocus}
                          />
                          <CustomRadio
                            checked={currentEval.conductFocus === 'distracted'}
                            onChange={() => handleUpdateField('conductFocus', 'distracted')}
                            label={t.attDistracted}
                          />
                        </div>

                        {/* Active options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5 bg-transparent">
                          <CustomRadio
                            checked={currentEval.conductActive === 'active'}
                            onChange={() => handleUpdateField('conductActive', 'active')}
                            label={t.attActive}
                          />
                          <CustomRadio
                            checked={currentEval.conductActive === 'passive'}
                            onChange={() => handleUpdateField('conductActive', 'passive')}
                            label={t.attPassive}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Section 2: KIẾN THỨC */}
                    <div className="space-y-1.5">
                      <SectionHeader
                        title={t.sectionKnowledge}
                        ratingValue={currentEval.knowledgeRating}
                        onRatingChange={(val) => handleUpdateField('knowledgeRating', val)}
                      />

                      <div className="space-y-1.5 pt-1">
                        {/* Vốn từ vựng Title & Radios */}
                        <div className="space-y-0.5">
                          <span className="block text-xs font-bold text-foreground">{t.vocabTitle}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.vocabLevel === 'rich'}
                              onChange={() => handleUpdateField('vocabLevel', 'rich')}
                              label={t.vocabRich}
                            />
                            <CustomRadio
                              checked={currentEval.vocabLevel === 'basic'}
                              onChange={() => handleUpdateField('vocabLevel', 'basic')}
                              label={t.vocabBasic}
                            />
                            <CustomRadio
                              checked={currentEval.vocabLevel === 'needs_improvement'}
                              onChange={() => handleUpdateField('vocabLevel', 'needs_improvement')}
                              label={t.vocabNeedsImprovement}
                            />
                          </div>
                        </div>

                        {/* Vocabulary Textareas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <span className="block text-[10.5px] font-bold text-foreground">{t.vocabLearnedLabel}</span>
                            <Textarea
                              value={currentEval.vocabLearned}
                              onChange={(e) => handleUpdateField('vocabLearned', e.target.value)}
                              placeholder={t.vocabLearnedPlaceholder}
                              className="text-xs min-h-[46px] bg-background border-zinc-200 rounded-lg shadow-2xs py-1 px-2.5"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[10.5px] font-bold text-foreground">{t.vocabNotLearnedLabel}</span>
                            <Textarea
                              value={currentEval.vocabNotLearned}
                              onChange={(e) => handleUpdateField('vocabNotLearned', e.target.value)}
                              placeholder={t.vocabNotLearnedPlaceholder}
                              className="text-xs min-h-[46px] bg-background border-zinc-200 rounded-lg shadow-2xs py-1 px-2.5"
                            />
                          </div>
                        </div>

                        {/* Vốn ngữ pháp Title & Radios */}
                        <div className="space-y-0.5 pt-1">
                          <span className="block text-xs font-bold text-foreground">{t.grammarTitle}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.grammarLevel === 'proficient'}
                              onChange={() => handleUpdateField('grammarLevel', 'proficient')}
                              label={t.grammarProficient}
                            />
                            <CustomRadio
                              checked={currentEval.grammarLevel === 'basic'}
                              onChange={() => handleUpdateField('grammarLevel', 'basic')}
                              label={t.grammarBasic}
                            />
                            <CustomRadio
                              checked={currentEval.grammarLevel === 'needs_improvement'}
                              onChange={() => handleUpdateField('grammarLevel', 'needs_improvement')}
                              label={t.grammarNeedsImprovement}
                            />
                          </div>
                        </div>

                        {/* Grammar Textareas */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="space-y-0.5">
                            <span className="block text-[10.5px] font-bold text-foreground">{t.grammarLearnedLabel}</span>
                            <Textarea
                              value={currentEval.grammarLearned}
                              onChange={(e) => handleUpdateField('grammarLearned', e.target.value)}
                              placeholder={t.grammarLearnedPlaceholder}
                              className="text-xs min-h-[46px] bg-background border-zinc-200 rounded-lg shadow-2xs py-1 px-2.5"
                            />
                          </div>
                          <div className="space-y-0.5">
                            <span className="block text-[10.5px] font-bold text-foreground">{t.grammarNotLearnedLabel}</span>
                            <Textarea
                              value={currentEval.grammarNotLearned}
                              onChange={(e) => handleUpdateField('grammarNotLearned', e.target.value)}
                              placeholder={t.grammarNotLearnedPlaceholder}
                              className="text-xs min-h-[46px] bg-background border-zinc-200 rounded-lg shadow-2xs py-1 px-2.5"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 3: KỸ NĂNG */}
                    <div className="space-y-1.5">
                      <SectionHeader
                        title={t.sectionSkills}
                        ratingValue={currentEval.skillsRating}
                        onRatingChange={(val) => handleUpdateField('skillsRating', val)}
                      />

                      <div className="space-y-1.5 pt-1">
                        {/* Kỹ năng nghe */}
                        <div className="space-y-0.5">
                          <span className="block text-xs font-bold text-foreground">{t.listeningTitle}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.listeningReaction === 'good'}
                              onChange={() => handleUpdateField('listeningReaction', 'good')}
                              label={t.listeningReactionGood}
                            />
                            <CustomRadio
                              checked={currentEval.listeningReaction === 'slow'}
                              onChange={() => handleUpdateField('listeningReaction', 'slow')}
                              label={t.listeningReactionSlow}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.listeningPractice === 'proficient'}
                              onChange={() => handleUpdateField('listeningPractice', 'proficient')}
                              label={t.listeningPracticeProficient}
                            />
                            <CustomRadio
                              checked={currentEval.listeningPractice === 'needs_practice'}
                              onChange={() => handleUpdateField('listeningPractice', 'needs_practice')}
                              label={t.listeningPracticeNeedsPractice}
                            />
                          </div>
                        </div>

                        {/* Kỹ năng nói */}
                        <div className="space-y-0.5 pt-1">
                          <span className="block text-xs font-bold text-foreground">{t.speakingTitle}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.speakingVolume === 'loud'}
                              onChange={() => handleUpdateField('speakingVolume', 'loud')}
                              label={t.speakingVolumeLoud}
                            />
                            <CustomRadio
                              checked={currentEval.speakingVolume === 'soft'}
                              onChange={() => handleUpdateField('speakingVolume', 'soft')}
                              label={t.speakingVolumeSoft}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.speakingPronunciation === 'correct'}
                              onChange={() => handleUpdateField('speakingPronunciation', 'correct')}
                              label={t.speakingPronunciationCorrect}
                            />
                            <CustomRadio
                              checked={currentEval.speakingPronunciation === 'incorrect'}
                              onChange={() => handleUpdateField('speakingPronunciation', 'incorrect')}
                              label={t.speakingPronunciationIncorrect}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.speakingFluency === 'fluent'}
                              onChange={() => handleUpdateField('speakingFluency', 'fluent')}
                              label={t.speakingFluencyFluent}
                            />
                            <CustomRadio
                              checked={currentEval.speakingFluency === 'hesitant'}
                              onChange={() => handleUpdateField('speakingFluency', 'hesitant')}
                              label={t.speakingFluencyHesitant}
                            />
                          </div>
                        </div>

                        {/* Kỹ năng đọc */}
                        <div className="space-y-0.5 pt-1">
                          <span className="block text-xs font-bold text-foreground">{t.readingTitle}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.readingComprehension === 'good'}
                              onChange={() => handleUpdateField('readingComprehension', 'good')}
                              label={t.readingComprehensionGood}
                            />
                            <CustomRadio
                              checked={currentEval.readingComprehension === 'needs_improvement'}
                              onChange={() => handleUpdateField('readingComprehension', 'needs_improvement')}
                              label={t.readingComprehensionNeedsImprovement}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.readingDetail === 'good'}
                              onChange={() => handleUpdateField('readingDetail', 'good')}
                              label={t.readingDetailGood}
                            />
                            <CustomRadio
                              checked={currentEval.readingDetail === 'poor'}
                              onChange={() => handleUpdateField('readingDetail', 'poor')}
                              label={t.readingDetailPoor}
                            />
                          </div>
                        </div>

                        {/* Kỹ năng viết */}
                        <div className="space-y-0.5 pt-1">
                          <span className="block text-xs font-bold text-foreground">{t.writingTitle}</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.writingSpelling === 'correct'}
                              onChange={() => handleUpdateField('writingSpelling', 'correct')}
                              label={t.writingSpellingCorrect}
                            />
                            <CustomRadio
                              checked={currentEval.writingSpelling === 'incorrect'}
                              onChange={() => handleUpdateField('writingSpelling', 'incorrect')}
                              label={t.writingSpellingIncorrect}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.writingVocab === 'rich'}
                              onChange={() => handleUpdateField('writingVocab', 'rich')}
                              label={t.writingVocabRich}
                            />
                            <CustomRadio
                              checked={currentEval.writingVocab === 'limited'}
                              onChange={() => handleUpdateField('writingVocab', 'limited')}
                              label={t.writingVocabLimited}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.writingExpression === 'clear'}
                              onChange={() => handleUpdateField('writingExpression', 'clear')}
                              label={t.writingExpressionClear}
                            />
                            <CustomRadio
                              checked={currentEval.writingExpression === 'unclear'}
                              onChange={() => handleUpdateField('writingExpression', 'unclear')}
                              label={t.writingExpressionUnclear}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                            <CustomRadio
                              checked={currentEval.writingGrammar === 'correct'}
                              onChange={() => handleUpdateField('writingGrammar', 'correct')}
                              label={t.writingGrammarCorrect}
                            />
                            <CustomRadio
                              checked={currentEval.writingGrammar === 'incorrect'}
                              onChange={() => handleUpdateField('writingGrammar', 'incorrect')}
                              label={t.writingGrammarIncorrect}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 4: TƯƠNG TÁC */}
                    <div className="space-y-1.5">
                      <SectionHeader
                        title={t.sectionInteraction}
                        ratingValue={currentEval.interactionRating}
                        onRatingChange={(val) => handleUpdateField('interactionRating', val)}
                      />

                      <div className="space-y-1 pt-1">
                        {/* Hoạt động lớp */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                          <CustomRadio
                            checked={currentEval.interClassActivity === 'active'}
                            onChange={() => handleUpdateField('interClassActivity', 'active')}
                            label={t.interClassActive}
                          />
                          <CustomRadio
                            checked={currentEval.interClassActivity === 'inactive'}
                            onChange={() => handleUpdateField('interClassActivity', 'inactive')}
                            label={t.interClassInactive}
                          />
                        </div>

                        {/* Chăm chú nghe giảng */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                          <CustomRadio
                            checked={currentEval.interFocus === 'attentive'}
                            onChange={() => handleUpdateField('interFocus', 'attentive')}
                            label={t.interFocusAttentive}
                          />
                          <CustomRadio
                            checked={currentEval.interFocus === 'inattentive'}
                            onChange={() => handleUpdateField('interFocus', 'inattentive')}
                            label={t.interFocusInattentive}
                          />
                        </div>

                        {/* Phát biểu ý kiến */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 py-0.5">
                          <CustomRadio
                            checked={currentEval.interContribution === 'voluntary'}
                            onChange={() => handleUpdateField('interContribution', 'voluntary')}
                            label={t.interContributionVoluntary}
                          />
                          <CustomRadio
                            checked={currentEval.interContribution === 'forced'}
                            onChange={() => handleUpdateField('interContribution', 'forced')}
                            label={t.interContributionForced}
                          />
                        </div>
                      </div>
                    </div>


                    {/* Submit Row */}
                    <div className="pt-2 border-t flex items-center justify-between">
                      <Button
                        type="button"
                        onClick={handleUpdate}
                        className="h-8 px-5 text-xs font-semibold rounded-lg bg-pink-600 hover:bg-pink-700 dark:bg-pink-700 dark:hover:bg-pink-800 text-white shrink-0 cursor-pointer"
                      >
                        {t.updateBtn}
                      </Button>

                      {currentEval.isSubmitted && (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" />
                          {t.updateSuccessBanner}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground italic text-xs">
                    {t.pleaseSelectStudent}
                  </div>
                )}
              </main>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
