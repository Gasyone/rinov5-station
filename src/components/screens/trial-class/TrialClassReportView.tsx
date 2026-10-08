'use client'

import { useMemo } from 'react'
import { Printer, Star } from 'lucide-react'
import { getTrialClasses } from '@/mocks/trialClasses'
import { formatSessionDateOnly } from './trialClassHelpers'

interface TrialClassReportViewProps {
  trialId: string
}

export function TrialClassReportView({ trialId }: TrialClassReportViewProps) {
  const trial = useMemo(() => {
    return getTrialClasses().find((t) => t.id === trialId) ?? null
  }, [trialId])

  if (!trial) {
    return (
      <div className="min-h-screen bg-[#fbf4e6] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 shadow max-w-md text-center space-y-2">
          <p className="font-semibold text-foreground">Không tìm thấy báo cáo học thử</p>
          <p className="text-xs text-muted-foreground">Mã phiếu {trialId} không tồn tại hoặc chưa có nhận xét.</p>
        </div>
      </div>
    )
  }

  const feedback = trial.feedback
  const activeSession = trial.sessions?.[0]
  const sessionDateText = activeSession?.trialDate
    ? formatSessionDateOnly(activeSession.trialDate)
    : '30/09/2026'

  // Dữ liệu hiển thị chuẩn theo báo cáo học thử
  const studentName = trial.studentName || 'Thảo Vy'
  const className = activeSession?.className || trial.program || 'Archimedes 6A'
  const location = trial.branch || trial.school || 'CS6 Vinsmart Tonkin'
  const teacherName = feedback?.teacherName || trial.owner || 'Hoàng Thị Ngọc Anh'
  const ratingText = feedback?.ratingText || 'Excellent'

  const learnedTopics = feedback?.learnedTopics?.length
    ? feedback.learnedTopics
    : [
        'Tìm hiểu hình ngũ giác, lục giác và thực hành tạo các hình này.',
        'Chơi trò tạo nhiều hình dạng khác nhau từ bảng chun hình học để củng cố nội dung về hình.',
      ]

  const strengths = feedback?.strengths?.length
    ? feedback.strengths
    : [
        'Con vui vẻ hợp tác, tập trung chủ động suy nghĩ và lên bảng trình bày suy nghĩ của mình.',
        'Con quan sát, nhận biết và vẽ được các hình học cơ bản như tam giác, tứ giác.',
      ]

  const weaknesses = feedback?.weaknesses?.length
    ? feedback.weaknesses
    : [
        'Con cần rèn luyện thêm để ghi nhớ tên gọi các hình như tam giác, tứ giác, lục giác, tránh nhầm lẫn.',
      ]

  const reminders = feedback?.reminders?.length
    ? feedback.reminders
    : ['Con hãy ôn lại tên gọi các hình đã học và luyện nhận biết từng hình.']

  return (
    <div className="min-h-screen bg-[#fbf4e6] text-slate-800 p-4 sm:p-8 md:p-12 font-sans print:bg-white print:p-0">
      <div className="max-w-3xl mx-auto space-y-6 print:max-w-none">
        {/* Header: Logo RinoEdu + Báo cáo học thử (Trái) & Thông tin phiếu (Phải) */}
        <header className="flex items-start justify-between gap-4 pb-2">
          <div>
            <div className="flex items-center gap-1.5">
              {/* Logo RinoEdu */}
              <div className="flex items-center">
                <span className="text-2xl font-black tracking-tight text-[#e11d48]">Rino</span>
                <span className="text-2xl font-black tracking-tight text-slate-900">Edu</span>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">Báo cáo học thử</h1>
          </div>

          <div className="text-xs text-slate-700 space-y-1 text-left sm:text-right">
            <div>
              <span className="text-slate-500 mr-2 sm:mr-3 inline-block">Học sinh:</span>
              <strong className="font-bold text-slate-900">{studentName}</strong>
            </div>
            <div>
              <span className="text-slate-500 mr-2 sm:mr-3 inline-block">Lớp:</span>
              <strong className="font-bold text-slate-900">{className}</strong>
            </div>
            <div>
              <span className="text-slate-500 mr-2 sm:mr-3 inline-block">Ngày học:</span>
              <strong className="font-bold text-slate-900">{sessionDateText}</strong>
            </div>
            <div>
              <span className="text-slate-500 mr-2 sm:mr-3 inline-block">Địa điểm:</span>
              <strong className="font-bold text-slate-900">{location}</strong>
            </div>
          </div>
        </header>

        {/* Card: Nhận xét của giáo viên */}
        <main className="space-y-3">
          <h2 className="text-center font-bold text-base sm:text-lg text-slate-900">
            Nhận xét của giáo viên
          </h2>

          <div className="rounded-2xl bg-white border border-[#ebdcc9] shadow-sm p-6 sm:p-8 space-y-5 print:border-none print:shadow-none">
            {/* Đánh giá */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-slate-800">Đánh giá</h3>
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-emerald-600 pt-0.5">{ratingText}</p>
            </div>

            {/* 🎯 Con đã học */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>🎯</span>
                <span>Con đã học</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc leading-relaxed">
                {learnedTopics.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 📝 Điểm sáng */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>📝</span>
                <span>Điểm sáng</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc leading-relaxed">
                {strengths.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 🌱 Cần cải thiện */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>🌱</span>
                <span>Cần cải thiện</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc leading-relaxed">
                {weaknesses.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* 🔔 Nhắc nhở: */}
            <div className="space-y-1.5 pt-1">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <span>🔔</span>
                <span>Nhắc nhở:</span>
              </h3>
              <ul className="text-xs text-slate-700 space-y-1 pl-4 list-disc leading-relaxed">
                {reminders.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Giáo viên */}
            <div className="pt-3 border-t border-slate-100 text-xs font-medium text-slate-800">
              Giáo viên: <strong className="font-semibold text-slate-900">{teacherName}</strong>
            </div>
          </div>
        </main>
      </div>

      {/* Nút in nổi ở góc phải dưới */}
      <button
        type="button"
        onClick={() => window.print()}
        className="fixed bottom-6 right-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-sky-600 shadow-lg border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer print:hidden"
        title="In phiếu kết quả"
      >
        <Printer className="h-4 w-4" />
        <span>In phiếu kết quả</span>
      </button>
    </div>
  )
}
