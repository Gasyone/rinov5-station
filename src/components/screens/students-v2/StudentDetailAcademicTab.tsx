'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Panel, InfoField } from '@/components/shared'
import { getStatusBadgeClass } from '@/lib/statusColors'
import type { Student } from '@/mocks/students'
import { Star, CheckCircle2, XCircle, AlertCircle, Sparkles, TrendingUp, BarChart2, BookOpen } from 'lucide-react'
import { getPlacementTestResultV2, getTrialClassFeedbackV2, getStudentSubjectsV2 } from './studentsV2Helpers'
import { useMemo, useState } from 'react'
import { SegmentedControl } from '@/components/controls'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface StudentDetailAcademicTabProps {
  student: Student
}

const SUBJECT_LABELS: Record<string, string> = {
  english: 'Tiếng Anh',
  math: 'Toán học',
  stem: 'STEM',
}

const SUBJECT_BADGE_CLASSES: Record<string, string> = {
  english: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-300 dark:border-indigo-900',
  math: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/20 dark:text-orange-300 dark:border-orange-900',
  stem: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-300 dark:border-purple-900',
}

interface AssessmentItem {
  session: string
  type: string
  comment: string
  score: string
  grade: string
  teacher: string
  date: string
  subjectCode: string
}

export function StudentDetailAcademicTab({ student }: StudentDetailAcademicTabProps) {
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedComment, setSelectedComment] = useState<AssessmentItem | null>(null)

  // Query placement test result
  const placementTest = useMemo(() => getPlacementTestResultV2(student), [student])

  // Query trial class result
  const trialClass = useMemo(() => getTrialClassFeedbackV2(student), [student])

  // Map trial class subject to standardized key
  const trialSubjectCode = useMemo(() => {
    if (!trialClass?.subject) return ''
    const s = trialClass.subject.toLowerCase()
    if (s.includes('anh') || s.includes('english')) return 'english'
    if (s.includes('toán') || s.includes('math')) return 'math'
    if (s.includes('stem') || s.includes('robot') || s.includes('code')) return 'stem'
    return ''
  }, [trialClass])

  // Multi-subject ongoing assessments
  const assessments = useMemo(() => {
    return [
      {
        session: 'Buổi 12: Writing - Academic Vocabulary',
        type: 'Unit Test',
        comment: 'Viết tốt, sử dụng nhiều cấu trúc so sánh hay. Cần chú ý lỗi chia động từ.',
        score: '6.5/10',
        grade: 'Good',
        teacher: 'Ms. Emily Watson',
        date: '2025-05-17',
        subjectCode: 'english',
      },
      {
        session: 'Buổi 10: Reading - True/False/Not Given',
        type: 'Unit Test',
        comment: 'Hoàn thành tốt phần đọc hiểu, nắm chắc cách loại trừ phương án sai.',
        score: '7.0/10',
        grade: 'Good',
        teacher: 'Ms. Emily Watson',
        date: '2025-05-03',
        subjectCode: 'english',
      },
      {
        session: 'Buổi 6: Midterm Assessment',
        type: 'Midterm',
        comment: 'Tiến bộ rõ rệt ở kỹ năng nghe. Kỹ năng nói cần tự tin phản xạ nhanh hơn.',
        score: '8.0/10',
        grade: 'Excellent',
        teacher: 'Ms. Emily Watson',
        date: '2025-04-18',
        subjectCode: 'english',
      },
      {
        session: 'Buổi 8: Fractions & Logic Problems',
        type: 'Unit Test',
        comment: 'Tính toán nhanh, giải thích logic rõ ràng. Cần chú ý trình bày các bước cẩn thận hơn.',
        score: '8.5/10',
        grade: 'Excellent',
        teacher: 'Thay Hung',
        date: '2025-05-12',
        subjectCode: 'math',
      },
      {
        session: 'Buổi 4: Geometry & Spatial Thinking',
        type: 'Unit Test',
        comment: 'Nhận diện hình khối rất tốt, tư duy không gian nhạy bén.',
        score: '9.0/10',
        grade: 'Excellent',
        teacher: 'Thay Hung',
        date: '2025-04-20',
        subjectCode: 'math',
      },
      {
        session: 'Buổi 5: Circuit Design & Robotics assembly',
        type: 'Unit Test',
        comment: 'Hoàn thành mạch điện đúng sơ đồ, lắp ráp mô hình robot chắc chắn.',
        score: '9.0/10',
        grade: 'Excellent',
        teacher: 'Mr. David',
        date: '2025-05-02',
        subjectCode: 'stem',
      }
    ]
  }, [])

  // Filtered assessments list
  const filteredAssessments = useMemo(() => {
    return assessments.filter(
      (ass) => selectedSubject === 'all' || ass.subjectCode === selectedSubject
    )
  }, [assessments, selectedSubject])

  // Competency Matrix with subject codes
  const competencyMatrix = useMemo(() => {
    const isIelts = student.level?.includes('IELTS')
    return [
      {
        skill: 'Listening (Nghe)',
        current: isIelts ? '5.0' : 'A2',
        target: isIelts ? '6.5' : 'B1',
        gap: isIelts ? '-1.5' : '-1',
        progress: 65,
        status: 'Improving',
        subjectCode: 'english',
      },
      {
        skill: 'Reading (Đọc)',
        current: isIelts ? '5.5' : 'A2+',
        target: isIelts ? '6.5' : 'B1',
        gap: isIelts ? '-1.0' : '-0.5',
        progress: 75,
        status: 'Stable',
        subjectCode: 'english',
      },
      {
        skill: 'Writing (Viết)',
        current: isIelts ? '4.5' : 'A1+',
        target: isIelts ? '6.5' : 'B1',
        gap: isIelts ? '-2.0' : '-1.5',
        progress: 50,
        status: 'Improving',
        subjectCode: 'english',
      },
      {
        skill: 'Speaking (Nói)',
        current: isIelts ? '4.5' : 'A1',
        target: isIelts ? '6.5' : 'B1',
        gap: isIelts ? '-2.0' : '-2',
        progress: 45,
        status: 'Improving',
        subjectCode: 'english',
      },
      {
        skill: 'Logic Reasoning (Tư duy Logic)',
        current: 'L2',
        target: 'L3',
        gap: '-1',
        progress: 60,
        status: 'Improving',
        subjectCode: 'math',
      },
      {
        skill: 'Geometry & Shapes (Hình học)',
        current: 'L2+',
        target: 'L3',
        gap: '-0.5',
        progress: 80,
        status: 'Stable',
        subjectCode: 'math',
      },
      {
        skill: 'Arithmetic calculation (Số học)',
        current: 'L1+',
        target: 'L3',
        gap: '-1.5',
        progress: 50,
        status: 'Improving',
        subjectCode: 'math',
      },
      {
        skill: 'Robotics Assembly (Lắp ráp)',
        current: 'A2',
        target: 'B1',
        gap: '-1',
        progress: 70,
        status: 'Improving',
        subjectCode: 'stem',
      },
      {
        skill: 'Coding logic (Tư duy lập trình)',
        current: 'A1+',
        target: 'B1',
        gap: '-1.5',
        progress: 55,
        status: 'Improving',
        subjectCode: 'stem',
      }
    ]
  }, [student.level])

  // Filtered competency matrix
  const filteredCompetencies = useMemo(() => {
    return competencyMatrix.filter(
      (comp) => selectedSubject === 'all' || comp.subjectCode === selectedSubject
    )
  }, [competencyMatrix, selectedSubject])

  const getScorePercentage = (scoreStr?: string) => {
    if (!scoreStr) return 0
    const parts = scoreStr.split('/')
    if (parts.length === 2) {
      const score = parseFloat(parts[0])
      const max = parseFloat(parts[1])
      return (score / max) * 100
    }
    return 0
  }

  // Dynamically determine available subjects for this student, ensuring all subjects with existing data are visible
  const availableSubjects = useMemo(() => {
    const base = getStudentSubjectsV2(student, placementTest, trialClass)
    const set = new Set(base)
    // Always include subjects if there are assessments or competencyMatrix entries for them
    assessments.forEach((ass) => set.add(ass.subjectCode))
    competencyMatrix.forEach((comp) => set.add(comp.subjectCode))
    return Array.from(set)
  }, [student, placementTest, trialClass, assessments, competencyMatrix])

  // Filter SegmentedControl options based on available subjects
  const subjectOptions = useMemo(() => {
    const options = [{ value: 'all', label: 'Tất cả' }]
    
    if (availableSubjects.includes('english')) {
      options.push({ value: 'english', label: 'Tiếng Anh' })
    }
    if (availableSubjects.includes('math')) {
      options.push({ value: 'math', label: 'Toán học' })
    }
    if (availableSubjects.includes('stem')) {
      options.push({ value: 'stem', label: 'STEM' })
    }
    
    return options
  }, [availableSubjects])

  // Conditions to show/hide Placement Test & Trial Class
  const showPlacementTest = placementTest && (selectedSubject === 'all' || placementTest.subject === selectedSubject)
  const showTrialClass = trialClass && (selectedSubject === 'all' || trialSubjectCode === selectedSubject)

  return (
    <div className="space-y-6 pt-2">
      {/* Subject Filter Switcher */}
      <div className="flex flex-col gap-2 bg-muted/20 p-3 rounded-xl border border-muted/50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <BookOpen className="h-4 w-4 text-primary" />
          Môn học lọc theo:
        </div>
        <SegmentedControl
          value={selectedSubject}
          onValueChange={setSelectedSubject}
          options={subjectOptions}
          className="w-full sm:w-auto"
        />
      </div>

      {/* 1. Placement Test Result */}
      {showPlacementTest && (
        <Panel title={`Kết quả đánh giá đầu vào (${SUBJECT_LABELS[placementTest.subject] || placementTest.subject})`}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Ngày kiểm tra" value={new Date(placementTest.testTime).toLocaleDateString('vi-VN')} />
              <InfoField label="Người đánh giá / Tester" value={placementTest.tester || 'Ms. Sarah'} />
              <InfoField
                label="Trạng thái"
                value={
                  <Badge variant="outline" className={getStatusBadgeClass(placementTest.status)}>
                    {placementTest.status === 'completed' ? 'Hoàn thành' : 'Đang xử lý'}
                  </Badge>
                }
              />
              <InfoField label="Trình độ quy đổi" value={placementTest.testResult?.level || 'Chưa xếp'} />
              <InfoField label="Sub-level xếp lớp" value={placementTest.testResult?.subLevel || '-'} />
              <InfoField label="Lộ trình đề xuất" value={placementTest.testResult?.path || 'Lộ trình cơ bản'} />
            </div>

            {/* Scores & Skill breakdown */}
            <div className="border-t pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
                <BarChart2 className="h-3.5 w-3.5 text-primary" />
                Điểm chi tiết theo kỹ năng
              </h4>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Speaking Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-foreground">Speaking (Nói trực tiếp với GV)</span>
                    <span className="font-mono font-bold text-indigo-600">{placementTest.testResult?.speaking || '0/8'}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all"
                      style={{ width: `${getScorePercentage(placementTest.testResult?.speaking)}%` }}
                    />
                  </div>
                  {placementTest.testResult?.speakingAi && (
                    <div className="text-[11px] text-muted-foreground flex justify-between">
                      <span>Điểm Speaking chấm bởi AI hỗ trợ:</span>
                      <span className="font-semibold text-foreground">{placementTest.testResult.speakingAi}</span>
                    </div>
                  )}
                </div>

                {/* Listening/Reading/Writing (LWR) Score */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-foreground">LWR (Nghe - Đọc - Viết tổng hợp)</span>
                    <span className="font-mono font-bold text-emerald-600">{placementTest.testResult?.lwr || '0/40'}</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all"
                      style={{ width: `${getScorePercentage(placementTest.testResult?.lwr)}%` }}
                    />
                  </div>
                  {placementTest.testResult?.lwrLevel && (
                    <div className="text-[11px] text-muted-foreground flex justify-between">
                      <span>Cấp độ bài thi LWR:</span>
                      <span className="font-semibold text-foreground">{placementTest.testResult.lwrLevel}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Teacher comment */}
            {placementTest.msg && (
              <div className="bg-muted/30 border border-muted p-3 rounded-xl text-xs text-foreground mt-2">
                <strong>Nhận xét từ Tester:</strong> &ldquo;{placementTest.msg}&rdquo;
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* 2. Trial Class Result */}
      {showTrialClass && (
        <Panel title={`Buổi học thử & Phản hồi giáo viên (${trialClass.subject})`}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <InfoField label="Ngày học thử" value={new Date(trialClass.sessions[0]?.trialDate).toLocaleDateString('vi-VN')} />
              <InfoField label="Lớp học thử" value={trialClass.sessions[0]?.className || '-'} />
              <InfoField label="Giáo viên đứng lớp" value={trialClass.owner} />
              <InfoField
                label="Đánh giá tổng quát"
                value={
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < (trialClass.feedback?.rating || 0)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-zinc-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">({trialClass.feedback?.rating || 0}/5)</span>
                  </div>
                }
              />
              <InfoField label="Trình độ đề xuất" value={trialClass.feedback?.recommendedLevel || '-'} />
              <InfoField
                label="Kết quả chốt"
                value={
                  <Badge
                    variant="outline"
                    className={
                      trialClass.status === 'completed'
                        ? 'border-emerald-200 text-emerald-700 bg-emerald-50/30'
                        : 'border-zinc-200 text-zinc-700'
                    }
                  >
                    {trialClass.status === 'completed' ? 'Đã nhập học' : 'Chưa nhập học'}
                  </Badge>
                }
              />
            </div>

            {/* Strengths / Weaknesses */}
            {trialClass.feedback && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border-t pt-4">
                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Điểm mạnh ghi nhận:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trialClass.feedback.strengths.map((str, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-emerald-50/50 text-emerald-800 border-emerald-100 font-medium text-[10px]">
                        {str}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="h-3.5 w-3.5" /> Điểm cần cải thiện:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {trialClass.feedback.weaknesses.map((weak, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-rose-50/50 text-rose-800 border-rose-100 font-medium text-[10px]">
                        {weak}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {trialClass.feedback?.comment && (
              <div className="bg-muted/30 border border-muted p-3 rounded-xl text-xs text-foreground">
                <strong>Nhận xét từ giáo viên học thử:</strong> &ldquo;{trialClass.feedback.comment}&rdquo;
              </div>
            )}
          </div>
        </Panel>
      )}

      {/* Fallback empty states for placement test / trial class when a filter is applied */}
      {!showPlacementTest && selectedSubject !== 'all' && (
        <Panel title={`Kết quả đánh giá đầu vào (${SUBJECT_LABELS[selectedSubject] || selectedSubject})`}>
          <div className="flex items-center gap-3 p-4 bg-amber-50/20 dark:bg-amber-950/5 border border-amber-100 dark:border-amber-950/30 rounded-xl text-sm text-amber-800 dark:text-amber-300">
            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-semibold">Không tìm thấy kết quả đánh giá môn {SUBJECT_LABELS[selectedSubject] || selectedSubject}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Học viên chưa thực hiện bài kiểm tra đầu vào (Placement Test) cho môn học này.</p>
            </div>
          </div>
        </Panel>
      )}

      {!showTrialClass && selectedSubject !== 'all' && (
        <Panel title={`Buổi học thử (${SUBJECT_LABELS[selectedSubject] || selectedSubject})`}>
          <div className="flex items-center gap-3 p-4 bg-muted/20 border border-muted/50 rounded-xl text-sm text-muted-foreground">
            <AlertCircle className="h-5 w-5 text-zinc-400 shrink-0" />
            <div>
              <p className="font-semibold text-foreground">Không có lịch sử học thử môn {SUBJECT_LABELS[selectedSubject] || selectedSubject}</p>
              <p className="text-xs mt-0.5">Học viên chưa tham gia buổi học thử nào đối với môn học này.</p>
            </div>
          </div>
        </Panel>
      )}

      {/* 3. Competency Matrix */}
      <Panel title="Ma trận năng lực kỹ năng (Competency Matrix)" icon={<Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />}>
        {filteredCompetencies.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground italic">
            Chưa có ma trận năng lực cho môn học này.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {selectedSubject === 'all' && <TableHead className="font-semibold text-xs">Môn học</TableHead>}
                  <TableHead className="font-semibold text-xs">Kỹ năng</TableHead>
                  <TableHead className="font-semibold text-xs">Level hiện tại</TableHead>
                  <TableHead className="font-semibold text-xs">Mục tiêu khóa</TableHead>
                  <TableHead className="font-semibold text-xs">Khoảng lệch (Gap)</TableHead>
                  <TableHead className="font-semibold text-xs">Tiến trình đạt được</TableHead>
                  <TableHead className="font-semibold text-xs">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompetencies.map((comp, idx) => (
                  <TableRow key={idx}>
                    {selectedSubject === 'all' && (
                      <TableCell>
                        <Badge variant="outline" className={`text-[9px] font-bold ${SUBJECT_BADGE_CLASSES[comp.subjectCode] || ''}`}>
                          {SUBJECT_LABELS[comp.subjectCode] || comp.subjectCode}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-sm font-semibold">{comp.skill}</TableCell>
                    <TableCell className="text-sm font-bold text-indigo-600">{comp.current}</TableCell>
                    <TableCell className="text-sm font-semibold">{comp.target}</TableCell>
                    <TableCell className="text-sm font-mono font-bold text-red-600">{comp.gap}</TableCell>
                    <TableCell className="w-[180px]">
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${comp.progress}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted-foreground font-mono">{comp.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-indigo-100 text-indigo-700 bg-indigo-50/20 text-[10px] flex items-center gap-1 w-fit">
                        <TrendingUp className="h-3 w-3" />
                        {comp.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>

      {/* 4. Ongoing Assessments */}
      <Panel title="Lịch sử đánh giá định kỳ trong khóa học">
        {filteredAssessments.length === 0 ? (
          <div className="p-4 text-center text-sm text-muted-foreground italic">
            Không có lịch sử đánh giá định kỳ cho môn học này.
          </div>
        ) : (
          <div className="overflow-x-auto border rounded-xl bg-card">
            <Table className="min-w-[900px]">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  {selectedSubject === 'all' && <TableHead className="w-[100px] font-semibold text-xs py-3">Môn học</TableHead>}
                  <TableHead className="w-[200px] font-semibold text-xs py-3">Buổi kiểm tra</TableHead>
                  <TableHead className="w-[110px] font-semibold text-xs py-3">Phân loại bài</TableHead>
                  <TableHead className="min-w-[250px] font-semibold text-xs py-3">Nhận xét chi tiết</TableHead>
                  <TableHead className="w-[90px] font-semibold text-xs py-3">Điểm số</TableHead>
                  <TableHead className="w-[110px] font-semibold text-xs py-3">Xếp loại</TableHead>
                  <TableHead className="w-[180px] font-semibold text-xs py-3">Giáo viên</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssessments.map((ass, idx) => (
                  <TableRow key={idx} className="hover:bg-muted/10">
                    {selectedSubject === 'all' && (
                      <TableCell className="py-3">
                        <Badge variant="outline" className={`text-[9px] font-bold ${SUBJECT_BADGE_CLASSES[ass.subjectCode] || ''}`}>
                          {SUBJECT_LABELS[ass.subjectCode] || ass.subjectCode}
                        </Badge>
                      </TableCell>
                    )}
                    <TableCell className="text-xs font-semibold text-foreground py-3 max-w-[200px] break-words">{ass.session}</TableCell>
                    <TableCell className="py-3">
                      <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 py-0.5">
                        {ass.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs leading-relaxed text-muted-foreground max-w-[300px] break-words py-3">
                      {ass.comment.length > 50 ? (
                        <>
                          <span>{ass.comment.substring(0, 50)}...</span>
                          <button
                            type="button"
                            onClick={() => setSelectedComment(ass)}
                            className="text-primary hover:underline font-semibold ml-1 cursor-pointer focus:outline-none"
                          >
                            [Xem chi tiết]
                          </button>
                        </>
                      ) : (
                        ass.comment
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-mono font-bold text-emerald-600 py-3">{ass.score}</TableCell>
                    <TableCell className="text-xs font-semibold text-foreground py-3">{ass.grade}</TableCell>
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6 border border-border">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${ass.teacher}`} alt={ass.teacher} />
                          <AvatarFallback className="text-[9px] font-bold">
                            {ass.teacher.split(' ').map((n: string) => n[0]).slice(-2).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-foreground font-medium truncate max-w-[120px]" title={ass.teacher}>
                          {ass.teacher}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Panel>

      {/* Dialog showing comment detail */}
      <Dialog open={!!selectedComment} onOpenChange={(open) => !open && setSelectedComment(null)}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl border bg-background p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-foreground">
              Chi tiết nhận xét đánh giá
            </DialogTitle>
          </DialogHeader>
          {selectedComment && (
            <div className="space-y-4 pt-2">
              <div className="rounded-xl bg-muted/30 p-3 border text-xs space-y-1.5">
                <div className="flex justify-between text-muted-foreground">
                  <span>Buổi kiểm tra:</span>
                  <span className="font-semibold text-foreground">{selectedComment.session}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Phân loại:</span>
                  <span className="font-semibold text-foreground uppercase">{selectedComment.type}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Điểm số:</span>
                  <span className="font-semibold text-emerald-600">{selectedComment.score}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Xếp loại:</span>
                  <span className="font-semibold text-foreground">{selectedComment.grade}</span>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">Nội dung nhận xét chi tiết:</span>
                <p className="text-xs text-foreground leading-relaxed bg-muted/10 p-3 rounded-xl border whitespace-pre-wrap">
                  {selectedComment.comment}
                </p>
              </div>
              
              <div className="flex items-center gap-2 border-t pt-3 justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedComment.teacher}`} />
                    <AvatarFallback className="text-xs font-bold">
                      {(selectedComment.teacher as string).split(' ').map((n: string) => n[0]).slice(-2).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">{selectedComment.teacher}</span>
                    <span className="text-[10px] text-muted-foreground">Giáo viên</span>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">{selectedComment.date}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
