'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import {
  ExternalLink,
  ChevronDown,
  Tablet,
  Pencil,
  Maximize2,
  Calendar,
  ClipboardCheck,
  GraduationCap,
  BookOpen,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { CrmLeadStudentEditForm } from './CrmLeadStudentEditForm'
import { CrmLeadAssessmentSchedulePopover } from './CrmLeadAssessmentSchedulePopover'
import { CrmLeadTrialFeedbackSection } from './CrmLeadTrialFeedbackSection'
import { getDefaultStudentSubjects } from './leadContactsHelper'
import type { ChildPersonaItem, StudentSubjectItem } from './CrmLeadChildCard'

export interface CrmLeadStudentProfileViewProps {
  student: ChildPersonaItem
  isEditing: boolean
  editedStudent: ChildPersonaItem
  setEditedStudent: React.Dispatch<React.SetStateAction<ChildPersonaItem>>
  onStartEdit?: () => void
  onCancelEdit?: () => void
  onSave?: () => void
  onZoom?: () => void
  onOpenBookingTest?: () => void
  onOpenTrialClass?: () => void
}

export function CrmLeadStudentProfileView({
  student,
  isEditing,
  editedStudent,
  setEditedStudent,
  onStartEdit,
  onCancelEdit,
  onSave,
  onZoom,
  onOpenBookingTest,
  onOpenTrialClass,
}: CrmLeadStudentProfileViewProps) {
  const router = useRouter()

  // Lấy danh sách các môn học (hỗ trợ Lead học nhiều môn cùng lúc)
  const subjectsList: StudentSubjectItem[] = useMemo(() => {
    const target = isEditing ? editedStudent : student
    if (target.subjects && target.subjects.length > 0) {
      return target.subjects
    }
    return getDefaultStudentSubjects(target.branch)
  }, [isEditing, editedStudent, student])

  const [activeSubjectId, setActiveSubjectId] = useState<string>(subjectsList[0]?.id || 'sub-01')

  // Đảm bảo activeSubject luôn hợp lệ khi đổi học sinh
  const currentSubject = useMemo(() => {
    return subjectsList.find((s) => s.id === activeSubjectId) || subjectsList[0]
  }, [subjectsList, activeSubjectId])

  const isMathSubject = useMemo(() => {
    return Boolean(currentSubject?.subjectName?.toLowerCase().includes('toán'))
  }, [currentSubject])

  const handleBookTest = () => {
    if (onOpenBookingTest) {
      onOpenBookingTest()
    } else {
      router.push(`/app/booking_test/create?leadId=${student.id}`)
    }
  }

  const handleBookTrial = () => {
    if (onOpenTrialClass) {
      onOpenTrialClass()
    } else {
      router.push(`/app/trial_class/create?leadId=${student.id}`)
    }
  }

  // Cờ kiểm tra xem môn học hiện tại có lịch/kết quả đánh giá hay không
  const hasTestBooking = useMemo(() => {
    if (typeof currentSubject?.hasTestBooking === 'boolean') {
      return currentSubject.hasTestBooking
    }
    const score = currentSubject?.testScore?.trim()
    const date = currentSubject?.testDate?.trim()
    const level = currentSubject?.testLevel?.trim()
    if (score && score !== 'Chưa kiểm tra' && score !== '--') return true
    if (date && date !== '--') return true
    if (level && level !== '--') return true
    return false
  }, [currentSubject])

  // Cờ kiểm tra xem môn học hiện tại có lịch/nhận xét học thử hay không
  const hasTrialBooking = useMemo(() => {
    if (typeof currentSubject?.hasTrialBooking === 'boolean') {
      return currentSubject.hasTrialBooking
    }
    const status = currentSubject?.trialStatus?.trim()
    const date = currentSubject?.trialDate?.trim()
    const teacher = currentSubject?.trialTeacher?.trim()
    const feedback = currentSubject?.teacherFeedback?.trim()
    if (status && status !== 'Chưa có' && status !== '--') return true
    if (date && date !== '--') return true
    if (teacher && teacher !== '--') return true
    if (feedback && feedback !== '--') return true
    return false
  }, [currentSubject])

  return (
    <div className="space-y-3 text-left select-none">
      {/* ============================================================ */}
      {/* NỘI DUNG CHÂN DUNG HỌC VIÊN: CHẾ ĐỘ CHỈNH SỬA / XEM CHI TIẾT */}
      {/* ============================================================ */}
      {isEditing ? (
        <CrmLeadStudentEditForm
          editedStudent={editedStudent}
          setEditedStudent={setEditedStudent}
          subjectsList={subjectsList}
          currentSubject={currentSubject}
          onCancel={onCancelEdit}
          onSave={onSave}
        />
      ) : (
        <div className="space-y-3.5">
          {/* ============================================================ */}
          {/* CỤM 1: TRƯỜNG HỌC, TRÌNH ĐỘ, TEST ĐẦU VÀO & HỌC THỬ (CHUẨN) */}
          {/* Gộp toàn bộ vào 1 cụm section, hỗ trợ lead nhiều môn         */}
          {/* ============================================================ */}
          <div className="p-3.5 rounded-xl border border-indigo-200/90 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between pb-1.5 border-b border-border/60 flex-wrap gap-2">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">
                <span>Học thuật, Đánh giá Test &amp; Trải nghiệm</span>
              </div>

              {/* Action buttons (Pencil & Zoom) - Đã xóa nhãn Đang tư vấn và đưa icon xuống đây theo yêu cầu */}
              <div className="flex items-center gap-0.5">
                {onStartEdit && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onStartEdit}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-indigo-700 hover:bg-indigo-100/70 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 cursor-pointer transition-colors shadow-none border-0"
                    title="Chỉnh sửa chân dung học viên"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                )}
                {onZoom && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onZoom}
                    className="h-7 w-7 rounded-lg text-muted-foreground hover:text-indigo-700 hover:bg-indigo-100/70 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 cursor-pointer transition-colors shadow-none border-0"
                    title="Phóng to chân dung học viên"
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Dòng thông tin trường và học lực (Chuẩn theo tạo mới / chi tiết hồ sơ: title text thường, không in hoa, không khối, không trình độ tiếp cận) */}
            <div className="p-2.5 rounded-lg bg-card border border-border/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="min-w-0">
                <span className="text-muted-foreground text-[11px] font-medium block">
                  Trường đang theo học hiện tại:
                </span>
                <p className={cn("font-semibold truncate pt-0.5 text-xs", student.school ? "text-foreground" : "text-muted-foreground/80 italic font-normal")} title={student.school}>
                  {student.school || 'Chưa cập nhật'}
                </p>
              </div>
              <div className="min-w-0">
                <span className="text-muted-foreground text-[11px] font-medium block">
                  Học lực hiện tại:
                </span>
                <p className={cn("font-semibold truncate pt-0.5 text-xs", student.academicPerformance ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground/80 italic font-normal")} title={student.academicPerformance}>
                  {student.academicPerformance || 'Chưa cập nhật'}
                </p>
              </div>
            </div>

            {/* ============================================================ */}
            {/* ============================================================ */}
            {/* ============================================================ */}
            {/* DANH SÁCH MÔN (BÊN TRÁI) VÀ NÚT ĐẶT LỊCH (BÊN PHẢI) */}
            <div className="w-full flex items-center justify-between gap-2 flex-wrap">
              {/* Danh sách các môn */}
              <div className="flex items-center gap-2 flex-wrap">
                {subjectsList.map((sub) => {
                  const isSelected = sub.id === currentSubject.id
                  const displayName = sub.subjectName.toLowerCase().includes('toán')
                    ? 'Toán'
                    : sub.subjectName.toLowerCase().includes('tiếng anh') || sub.subjectName.toLowerCase().includes('anh')
                    ? 'Tiếng Anh'
                    : sub.subjectName

                  return (
                    <button
                      key={sub.id}
                      type="button"
                      onClick={() => setActiveSubjectId(sub.id)}
                      className={cn(
                        'h-7.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border',
                        isSelected
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-card hover:bg-muted text-foreground border-border/80'
                      )}
                    >
                      <span
                        className={cn(
                          'h-1.5 w-1.5 rounded-full shrink-0',
                          isSelected ? 'bg-white' : 'bg-muted-foreground/40'
                        )}
                      />
                      <span>{displayName}</span>
                    </button>
                  )
                })}
              </div>

              {/* NÚT ĐẶT LỊCH Ở CẠNH PHẢI (MENU LỰA CHỌN: ĐÁNH GIÁ & HỌC THỬ) */}
              <div className="ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-7.5 px-2.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800 cursor-pointer flex items-center gap-1 shadow-none"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Đặt lịch</span>
                      <ChevronDown className="h-3 w-3 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 p-1">
                  <DropdownMenuItem
                    onClick={handleBookTest}
                    className="cursor-pointer flex items-center gap-2 text-xs font-medium py-2 rounded-md"
                  >
                    <ClipboardCheck className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                    <span>Đánh giá</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleBookTrial}
                    className="cursor-pointer flex items-center gap-2 text-xs font-medium py-2 rounded-md"
                  >
                    <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Học thử</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

            {/* Chi tiết học thuật & đánh giá của môn đang chọn */}
            <div className="space-y-2.5">

              {/* HÀNG 2: KẾT QUẢ ĐÁNH GIÁ TRÌNH ĐỘ (Ẩn nếu lead mới chưa có booking đánh giá) */}
              {hasTestBooking && (
                <div className="p-3 rounded-lg bg-card border border-sky-200/80 dark:border-sky-900/60 space-y-2.5">
                {/* Header: Lịch đánh giá tinh gọn (2 dòng, có liên kết mở Popover chi tiết) */}
                <div className="space-y-2 pb-2.5 border-b border-border/60">
                  {/* Dòng 1: Lịch đánh giá: [Ngày giờ test có link mở Popover] | [Trạng thái] */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-muted-foreground font-normal">Lịch đánh giá:</span>
                      <CrmLeadAssessmentSchedulePopover
                        student={student}
                        currentSubject={currentSubject}
                        isMathSubject={isMathSubject}
                      >
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 dark:text-sky-300 hover:text-sky-900 dark:hover:text-sky-100 hover:underline cursor-pointer transition-colors"
                          title="Nhấp để xem chi tiết lịch đánh giá"
                        >
                          <Calendar className="h-3.5 w-3.5 text-sky-600 shrink-0" />
                          <span>{currentSubject.testDate || '25/08/2026'}</span>
                          <span className="text-muted-foreground/40">•</span>
                          <span>{currentSubject.testTime || '18:00'}</span>
                          <ExternalLink className="h-2.5 w-2.5 text-sky-600/80 shrink-0 ml-0.5" />
                        </button>
                      </CrmLeadAssessmentSchedulePopover>
                    </div>

                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800">
                      {currentSubject.statusLabel || 'Đang tư vấn'}
                    </span>
                  </div>

                  {/* Dòng 2: Thông tin chính: Chương trình (trái) | Cơ sở (cạnh phải) */}
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="font-semibold text-foreground">
                        {currentSubject.testProgram || currentSubject.subjectName}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 ml-auto">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="font-semibold text-foreground">
                        {currentSubject.testBranch || currentSubject.branch || student.branch || 'RinoEdu Linh Đàm'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Khối Trình độ & Trình độ đạt được (Đã xóa Speaking và LWR, title viết thường không in hoa) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Cột 1: Trình độ (đưa xuống dưới trước trình độ đạt được) */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      Trình độ
                    </span>
                    <div className="h-6 flex items-center font-semibold text-foreground text-xs">
                      <span>
                        {currentSubject.testTargetLevel || currentSubject.courseLevel || (isMathSubject ? 'Tư duy Tiểu học Cấp độ 2' : 'Flyers Intensive Cấp độ 3')}
                      </span>
                    </div>
                  </div>

                  {/* Cột 2: Trình độ đạt được */}
                  <div className="space-y-0.5">
                    <span className="text-[11px] text-muted-foreground font-medium block">
                      Trình độ đạt được
                    </span>
                    <div className="h-6 flex items-center font-bold text-foreground text-xs">
                      <span>
                        {currentSubject.testLevel || 'Level 2B'}
                        {currentSubject.testSubLevel ? ` - ${currentSubject.testSubLevel}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5 Kỹ năng Đánh giá năng lực (Tiếng Anh hoặc Toán theo môn) */}
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/60 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <span>
                        {isMathSubject
                          ? 'Năng lực 5 kỹ năng (Đánh giá Năng lực Toán & Logic)'
                          : 'Năng lực 5 kỹ năng (Placement Test Tiếng Anh)'}
                      </span>
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Tổng điểm: <span className="text-rose-600 dark:text-rose-400 font-extrabold">{currentSubject.testScore || '8.5/10'}</span>
                    </span>
                  </div>

                  {/* 5 thanh kỹ năng */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                    <div className="p-1.5 rounded-md bg-card border border-border/60 space-y-1">
                      <span className="text-muted-foreground text-[10px] block">
                        {isMathSubject ? 'Phản xạ logic' : 'Phản xạ'}
                      </span>
                      <div className="font-bold text-sky-600 dark:text-sky-400">{currentSubject.testRadarSkills?.reflex ?? 31}%</div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${currentSubject.testRadarSkills?.reflex ?? 31}%` }} />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-md bg-card border border-border/60 space-y-1">
                      <span className="text-muted-foreground text-[10px] block">
                        {isMathSubject ? 'Hình khối' : 'Phát âm'}
                      </span>
                      <div className="font-bold text-rose-600 dark:text-rose-400">{currentSubject.testRadarSkills?.pronunciation ?? 75}%</div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${currentSubject.testRadarSkills?.pronunciation ?? 75}%` }} />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-md bg-card border border-border/60 space-y-1">
                      <span className="text-muted-foreground text-[10px] block">
                        {isMathSubject ? 'Số học nhẩm' : 'Từ - Cấu trúc'}
                      </span>
                      <div className="font-bold text-amber-600 dark:text-amber-400">{currentSubject.testRadarSkills?.vocabGrammar ?? 65}%</div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${currentSubject.testRadarSkills?.vocabGrammar ?? 65}%` }} />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-md bg-card border border-border/60 space-y-1">
                      <span className="text-muted-foreground text-[10px] block">
                        {isMathSubject ? 'Đọc hiểu đề' : 'Đọc - Viết'}
                      </span>
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{currentSubject.testRadarSkills?.readingWriting ?? 70}%</div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${currentSubject.testRadarSkills?.readingWriting ?? 70}%` }} />
                      </div>
                    </div>

                    <div className="p-1.5 rounded-md bg-card border border-border/60 space-y-1 col-span-2 sm:col-span-1">
                      <span className="text-muted-foreground text-[10px] block">
                        {isMathSubject ? 'Tập trung logic' : 'Nghe hiểu'}
                      </span>
                      <div className="font-bold text-indigo-600 dark:text-indigo-400">{currentSubject.testRadarSkills?.listening ?? 80}%</div>
                      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${currentSubject.testRadarSkills?.listening ?? 80}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Điểm mạnh & Điểm cần cải thiện */}
                  <div className="pt-1.5 space-y-1 text-xs border-t border-border/50">
                    <p className="text-[11px] leading-relaxed text-emerald-800 dark:text-emerald-300">
                      <strong className="font-bold">Điểm mạnh:</strong> {currentSubject.testStrengths || 'Ghi nhớ tốt, phản xạ nhanh...'}
                    </p>
                    <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                      <strong className="font-bold">Cần cải thiện:</strong> {currentSubject.testImprovements || 'Cần luyện tập thêm phản xạ và kiến thức trọng tâm.'}
                    </p>
                  </div>
                </div>

                {/* 2 Link xem kết quả từ iPad & Xem trang đánh giá chi tiết đưa xuống dưới cùng */}
                <div className="pt-2 border-t border-border/60 flex items-center justify-end gap-3 text-xs">
                  <a
                    href={currentSubject.ipadTestLink || 'https://rinoedu.ai'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-sky-600 hover:text-sky-800 dark:text-sky-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <Tablet className="h-3 w-3" />
                    <span>Xem kết quả từ iPad</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                  <a
                    href={currentSubject.detailReportLink || '/app/booking_test'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <span>Xem trang đánh giá chi tiết</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              </div>
              )}

              {/* HÀNG 3: LỊCH LỚP HỌC THỬ & NHẬN XÉT CỦA GIÁO VIÊN (Ẩn nếu lead mới chưa có booking học thử) */}
              {hasTrialBooking && (
                <CrmLeadTrialFeedbackSection
                  currentSubject={currentSubject}
                  studentNotes={student.notes}
                  studentName={student.name}
                />
              )}

              {/* TRẠNG THÁI CHƯA CÓ LỊCH TEST VÀ CHƯA CÓ LỊCH HỌC THỬ (DÀNH CHO LEAD MỚI) */}
              {!hasTestBooking && !hasTrialBooking && (
                <div className="py-6 px-4 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center space-y-2.5">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-foreground">
                      Chưa có lịch đánh giá hoặc học thử
                    </p>
                    <p className="text-[11px] text-muted-foreground max-w-md mx-auto">
                      Học viên mới tiếp nhận chưa có dữ liệu đánh giá năng lực hoặc nhận xét học thử cho môn này.
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleBookTest}
                      className="h-7.5 text-xs font-semibold text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-sky-950 cursor-pointer shadow-none"
                    >
                      <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
                      <span>Đặt lịch đánh giá</span>
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleBookTrial}
                      className="h-7.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 cursor-pointer shadow-none"
                    >
                      <GraduationCap className="h-3.5 w-3.5 mr-1" />
                      <span>Đặt lịch học thử</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================ */}
          {/* CỤM 2: TÂM LÝ & PHƯƠNG PHÁP HỌC TẬP (MỤC TIÊU Ở TRÊN CÙNG) */}
          {/* 4 thông tin gom chung 1 khối thống nhất, không tách 4 khối  */}
          {/* ============================================================ */}
          <div className="p-3.5 rounded-xl border border-border/80 bg-card space-y-3 shadow-2xs">
            <div className="text-xs font-bold text-purple-900 dark:text-purple-300 pb-1.5 border-b border-border/60">
              <span>Đặc điểm tâm lý &amp; Phương pháp học tập</span>
            </div>

            {/* 1. MỤC TIÊU HỌC TẬP CỦA CON (ĐƯỢC ĐẶT LÊN TRÊN CÙNG) */}
            <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-900/70 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                <span>Mục tiêu học tập &amp; Kỳ vọng cam kết đầu ra</span>
              </div>
              {student.learningGoal ? (
                <p className="text-xs font-semibold text-foreground leading-relaxed">
                  {student.learningGoal}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground/80 italic font-normal">
                  Chưa cập nhật (Cập nhật sau)
                </p>
              )}
            </div>

            {/* 2. GOM 4 THÔNG TIN (VARK, TÍNH CÁCH, SỞ THÍCH, ĐIỂM MẠNH/YẾU) TRONG 1 CỤM THỐNG NHẤT */}
            <div className="p-3 rounded-lg border border-border/70 bg-muted/20 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Phong cách tiếp thu VARK */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground">
                  <span>Phong cách tiếp thu (VARK)</span>
                </div>
                <p className={cn("text-xs leading-relaxed", student.learningStyle ? "text-muted-foreground" : "text-muted-foreground/80 italic")}>
                  {student.learningStyle || 'Chưa cập nhật (Cập nhật sau)'}
                </p>
              </div>

              {/* Tính cách & Tâm lý lớp học */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground">
                  <span>Tính cách &amp; Tâm lý lớp học</span>
                </div>
                <p className={cn("text-xs leading-relaxed", student.personality ? "text-muted-foreground" : "text-muted-foreground/80 italic")}>
                  {student.personality || 'Chưa cập nhật (Cập nhật sau)'}
                </p>
              </div>

              {/* Sở thích & Đam mê ngoài giờ */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground">
                  <span>Sở thích &amp; Đam mê</span>
                </div>
                <p className={cn("text-xs leading-relaxed", student.interests ? "text-muted-foreground" : "text-muted-foreground/80 italic")}>
                  {student.interests || 'Chưa cập nhật (Cập nhật sau)'}
                </p>
              </div>

              {/* Điểm mạnh & Điểm cần rèn */}
              <div className="space-y-1">
                <div className="text-xs font-bold text-foreground">
                  <span>Điểm mạnh &amp; Cần rèn giũa</span>
                </div>
                <div className="text-xs space-y-0.5">
                  <p>
                    <strong className="text-emerald-700 dark:text-emerald-400">Mạnh:</strong>{' '}
                    <span className={cn(student.strengths ? "text-muted-foreground" : "text-muted-foreground/80 italic")}>
                      {student.strengths || 'Chưa cập nhật (Cập nhật sau)'}
                    </span>
                  </p>
                  <p>
                    <strong className="text-amber-700 dark:text-amber-400">Cần rèn:</strong>{' '}
                    <span className={cn(student.weaknesses ? "text-muted-foreground" : "text-muted-foreground/80 italic")}>
                      {student.weaknesses || 'Chưa cập nhật (Cập nhật sau)'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
