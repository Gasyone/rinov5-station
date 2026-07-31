'use client'

import { useState } from 'react'
import { BookOpen, Copy, Check, HelpCircle, AlertCircle, AlertOctagon, Flame, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  CallScript,
  CallScriptResponse,
  mockCallScripts,
} from '@/mocks/callScripts'

interface CallScriptPanelProps {
  studentName: string
  parentName: string
  onAppendNote: (text: string) => void
  initialScript: CallScript
}

export function CallScriptPanel({
  studentName,
  parentName,
  onAppendNote,
  initialScript,
}: CallScriptPanelProps) {
  const [isEmergencyMode, setIsEmergencyMode] = useState<boolean>(initialScript.isEmergency ?? false)
  const [selectedScript, setSelectedScript] = useState<CallScript>(initialScript)
  const [activeStepIdx, setActiveStepIdx] = useState<number>(0)
  const [selectedResponse, setSelectedResponse] = useState<CallScriptResponse | null>(null)
  
  // States for "Other Feedback" input
  const [isOtherResponseOpen, setIsOtherResponseOpen] = useState(false)
  const [otherResponseText, setOtherResponseText] = useState('')
  
  // State to track which segment was copied
  const [copiedSegmentIdx, setCopiedSegmentIdx] = useState<number | null>(null)

  // Sync script when initialScript changes using render-time state adjustment
  const [lastInitialScript, setLastInitialScript] = useState<CallScript>(initialScript)
  if (initialScript.id !== lastInitialScript.id) {
    setLastInitialScript(initialScript)
    setSelectedScript(initialScript)
    setIsEmergencyMode(initialScript.isEmergency ?? false)
    setActiveStepIdx(0)
    setSelectedResponse(null)
    setIsOtherResponseOpen(false)
    setOtherResponseText('')
  }

  const filteredScripts = mockCallScripts.filter(s => !!s.isEmergency === isEmergencyMode)
  const activeStep = selectedScript.steps[activeStepIdx] || selectedScript.steps[0]

  // Helper to replace template variables with actual values
  const processTemplate = (text: string) => {
    return text
      .replace(/{studentName}/g, studentName || 'Học viên')
      .replace(/{parentName}/g, parentName || 'Phụ huynh')
      .replace(/{agentName}/g, 'Thảo Nguyên') // Mock agent name
      .replace(/{dateTime}/g, '18:30 - Ngày mai (Thứ 5)')
      .replace(/{branchName}/g, 'Chi nhánh Rinov5 Quận 3')
      .replace(/{attendanceRate}/g, '95%')
      .replace(/{examScore}/g, '8.8/10')
      .replace(/{remainingSessions}/g, '4 buổi')
      .replace(/{discountPercent}/g, '20%')
      .replace(/{nextLevel}/g, 'Super Stars 2')
      .replace(/{monthlyRate}/g, '1.650.000đ')
  }

  const handleCopySegment = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedSegmentIdx(idx)
    toast.success('Đã sao chép phân đoạn kịch bản!')
    setTimeout(() => setCopiedSegmentIdx(null), 1500)
  }

  const handleResponseClick = (resp: CallScriptResponse) => {
    setSelectedResponse(resp)
    setIsOtherResponseOpen(false)
    const processedNote = processTemplate(resp.appendNote)
    onAppendNote(processedNote)
    toast.info(`Đã chèn ghi chú nhanh: "${resp.text}"`)
  }

  const handleSendOtherResponse = () => {
    if (!otherResponseText.trim()) {
      toast.warning('Vui lòng nhập nội dung phản hồi!')
      return
    }
    const cleanText = otherResponseText.trim()
    onAppendNote(`Phụ huynh ý kiến: ${cleanText}`)
    toast.success(`Đã chèn phản hồi khác: "${cleanText}"`)
    setOtherResponseText('')
    setIsOtherResponseOpen(false)
  }

  const handleScriptSelect = (script: CallScript) => {
    setSelectedScript(script)
    setActiveStepIdx(0)
    setSelectedResponse(null)
    setIsOtherResponseOpen(false)
    setOtherResponseText('')
  }

  const toggleEmergencyMode = (emergency: boolean) => {
    setIsEmergencyMode(emergency)
    const available = mockCallScripts.filter(s => !!s.isEmergency === emergency)
    if (available.length > 0) {
      handleScriptSelect(available[0])
    }
  }

  return (
    <div className="w-[650px] bg-background flex flex-row h-full overflow-hidden animate-fade-in shrink-0">
      
      {/* 1. Left Sidebar: Script Selection (w-[180px]) */}
      <div className="w-[180px] bg-zinc-50/40 dark:bg-zinc-950/15 flex flex-col h-full shrink-0">
        
        {/* Toggle Mode header */}
        <div className="p-3.5 space-y-2">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
            Chế độ kịch bản
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => toggleEmergencyMode(false)}
              className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-lg transition-all ${
                !isEmergencyMode
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-background text-zinc-650 hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-150 dark:border-zinc-800'
              }`}
            >
              Thường
            </button>
            <button
              onClick={() => toggleEmergencyMode(true)}
              className={`flex-1 text-[10px] font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 transition-all ${
                isEmergencyMode
                  ? 'bg-red-600 text-white shadow-xs animate-pulse'
                  : 'bg-background text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 border border-red-100 dark:border-red-950/20'
              }`}
              title="Kích hoạt kịch bản xử lý khẩn cấp"
            >
              <Flame className="h-3 w-3 fill-current" />
              Khẩn
            </button>
          </div>
        </div>

        {/* List of Scripts */}
        <div className="flex-1 overflow-y-auto px-2 pb-3.5 space-y-1.5 scrollbar-none">
          <span className="px-2 text-[8px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">
            Danh sách ({filteredScripts.length})
          </span>
          
          {filteredScripts.map((script) => {
            const isSelected = script.id === selectedScript.id
            return (
              <button
                key={script.id}
                onClick={() => handleScriptSelect(script)}
                className={`w-full text-left p-2.5 rounded-xl text-[10px] font-medium leading-normal transition-all flex flex-col gap-1 ${
                  isSelected
                    ? isEmergencyMode
                      ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-semibold shadow-xs'
                      : 'bg-indigo-50/50 dark:bg-indigo-950/15 text-indigo-700 dark:text-indigo-400 font-semibold shadow-xs'
                    : 'bg-transparent hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 text-zinc-700 dark:text-zinc-350'
                }`}
              >
                <span className="truncate w-full">{script.title}</span>
                {isSelected && (
                  <span className="text-[8px] opacity-75 font-normal line-clamp-1">
                    {script.menuId.replace('_v2', '')}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Right Column: Script Details & Stepper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        
        {/* Header */}
        <div className="px-4 py-3 flex items-center gap-2 bg-zinc-50/10 dark:bg-zinc-950/5">
          {isEmergencyMode ? (
            <AlertOctagon className="h-4 w-4 text-red-500 animate-bounce" />
          ) : (
            <BookOpen className="h-4 w-4 text-indigo-500" />
          )}
          <div className="min-w-0">
            <h4 className="text-[11px] font-bold text-foreground truncate">
              {selectedScript.title}
            </h4>
            <p className="text-[8px] text-muted-foreground truncate font-medium">
              {selectedScript.description}
            </p>
          </div>
        </div>

        {/* Stepper Tabs */}
        <div className="px-3 py-1.5 bg-background overflow-x-auto scrollbar-none flex gap-1 shrink-0">
          {selectedScript.steps.map((step, idx) => {
            const isActive = idx === activeStepIdx
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStepIdx(idx)
                  setSelectedResponse(null)
                  setIsOtherResponseOpen(false)
                }}
                className={`text-[9px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? isEmergencyMode
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-850 text-muted-foreground hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                {step.label.split('. ')[0] === step.label ? step.label : step.label.split('. ')[1]}
              </button>
            )
          })}
        </div>

        {/* Script Content Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
          
          {/* Lời thoại đề xuất - Phân đoạn theo Mục tiêu */}
          <div className="space-y-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              Lời thoại đề xuất (Theo phân đoạn)
            </span>
            
            <div className="space-y-3">
              {activeStep.segments.map((seg, idx) => {
                const isCopied = copiedSegmentIdx === idx
                const processedText = processTemplate(seg.dialogue)
                return (
                  <div
                    key={idx}
                    className="group rounded-2xl bg-zinc-50/45 dark:bg-zinc-950/20 overflow-hidden shadow-xs transition-colors"
                  >
                    {/* Segment Header */}
                    <div className="px-3.5 py-1.5 bg-zinc-100/30 dark:bg-zinc-900/30 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-indigo-650 dark:text-indigo-400">
                        {seg.goalTitle}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopySegment(processedText, idx)}
                        className="text-zinc-400 hover:text-foreground p-0.5 rounded transition-colors"
                        title="Sao chép phân đoạn này"
                      >
                        {isCopied ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    {/* Dialogue Text */}
                    <p className="px-4 pb-3 pt-1 text-[11px] leading-relaxed text-zinc-800 dark:text-zinc-200 font-medium select-text">
                      {processedText}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Phản hồi nhanh của Phụ huynh */}
          <div className="space-y-2 pt-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
              Ghi nhận phản hồi của Phụ huynh
            </span>
            
            <div className="flex flex-wrap gap-1.5">
              {activeStep.responses.map((resp) => {
                const isSelected = selectedResponse?.id === resp.id
                return (
                  <button
                    key={resp.id}
                    type="button"
                    onClick={() => handleResponseClick(resp)}
                    className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all border border-transparent ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 shadow-xs scale-98'
                        : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-foreground'
                    }`}
                  >
                    {resp.text}
                  </button>
                )
              })}
              
              {/* Other response toggle button */}
              <button
                type="button"
                onClick={() => setIsOtherResponseOpen(!isOtherResponseOpen)}
                className={`text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all border border-transparent ${
                  isOtherResponseOpen
                    ? 'bg-indigo-50 dark:bg-indigo-950/25 text-indigo-650 dark:text-indigo-400 shadow-xs'
                    : 'bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-850 text-foreground'
                }`}
              >
                + Khác...
              </button>
            </div>

            {/* Custom Description Text Input */}
            {isOtherResponseOpen && (
              <div className="flex gap-1.5 mt-2.5 w-full animate-fade-in bg-zinc-50/40 dark:bg-zinc-900/30 p-2.5 rounded-2xl">
                <input
                  type="text"
                  value={otherResponseText}
                  onChange={(e) => setOtherResponseText(e.target.value)}
                  placeholder="Nhập phản hồi tự do khác..."
                  className="flex-1 text-[11px] border border-transparent rounded-xl px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleSendOtherResponse()
                    }
                  }}
                  autoFocus
                />
                <Button
                  size="sm"
                  className="h-8 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1 rounded-xl"
                  onClick={handleSendOtherResponse}
                >
                  Gửi
                  <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          {/* Xử lý từ chối (Objection Handling Suggestion) */}
          {selectedResponse?.objectionHandling && (
            <div className="rounded-2xl bg-amber-50/35 dark:bg-amber-950/10 p-3.5 space-y-1.5 animate-fade-in shadow-xs">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  Gợi ý xử lý tình huống
                </span>
              </div>
              <p className="text-[10px] text-zinc-700 dark:text-zinc-300 leading-relaxed font-semibold">
                {processTemplate(selectedResponse.objectionHandling)}
              </p>
            </div>
          )}
        </div>

        {/* Footer Instructions */}
        <div className="p-2.5 bg-zinc-50/30 dark:bg-zinc-900/10 shrink-0 text-center flex items-center justify-center gap-1">
          <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-[8px] text-zinc-500 dark:text-zinc-400 font-semibold">
            Bên Trái: Kịch bản phân đoạn | Bên Phải: Thao tác điều khiển cuộc gọi
          </span>
        </div>
      </div>
    </div>
  )
}
