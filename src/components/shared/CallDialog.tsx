'use client'

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { DismissableLayerBranch } from '@radix-ui/react-dismissable-layer'
import { FocusScope } from '@radix-ui/react-focus-scope'
import {
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Check,
  X,
  Play,
  Pause,
  Disc,
  Clock,
} from 'lucide-react'
import { useCallStore } from '@/stores/useCallStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { mockStudents } from '@/mocks/students'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function CallDialog() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const {
    status,
    studentId,
    studentName,
    parentPhone,
    parentName,
    duration,
    connectCall,
    endCall,
    saveCallLog,
    resetCall,
  } = useCallStore()

  // Local UI Toggles
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)

  // Audio Playback Simulation State
  const [playbackIsPlaying, setPlaybackIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)

  // Call Logging Form State
  const [noteText, setNoteText] = useState('')
  const [parentOpinionText, setParentOpinionText] = useState('')

  // In-Call Live Bullet Notes list
  const [quickNotes, setQuickNotes] = useState<string[]>([''])
  const noteInputRef = useRef<HTMLTextAreaElement | null>(null)

  // Auto-focus note textarea when call ends
  useEffect(() => {
    if (status === 'ended') {
      const timer = setTimeout(() => {
        noteInputRef.current?.focus()
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [status])

  // State adjustment during render when studentId changes to prevent stale UI
  const [lastStudentId, setLastStudentId] = useState<string | null>(null)
  if (studentId !== lastStudentId) {
    setLastStudentId(studentId)
    setIsMuted(false)
    setIsSpeakerOn(true)
    setNoteText('')
    setParentOpinionText('')
    setQuickNotes([''])
  }

  // Adjust states on phase status changes: Auto-consolidate bullet notes into noteText
  const [lastStatus, setLastStatus] = useState<typeof status>('idle')
  if (status !== lastStatus) {
    setLastStatus(status)
    if (status === 'ended') {
      const activeNotes = quickNotes.map((n) => n.trim()).filter(Boolean)
      if (activeNotes.length > 0 && !noteText) {
        setNoteText(activeNotes.map((n) => `• ${n}`).join('\n'))
      }
    }
    if (status === 'dialing') {
      setQuickNotes([''])
      setNoteText('')
      setParentOpinionText('')
      setPlaybackIsPlaying(false)
      setPlaybackProgress(0)
    }
  }

  // Simulated playback progress
  useEffect(() => {
    if (!playbackIsPlaying) return
    const interval = setInterval(() => {
      setPlaybackProgress((prev) => {
        if (prev >= 100) {
          setPlaybackIsPlaying(false)
          toast.info('Kết thúc nghe lại cuộc ghi âm')
          return 0
        }
        return prev + 5
      })
    }, 250)
    return () => clearInterval(interval)
  }, [playbackIsPlaying])

  // Dialing simulation timeout ref
  const autoConnectRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-connect call after 3.5s for realistic telecom dialing experience
  useEffect(() => {
    if (status === 'dialing') {
      autoConnectRef.current = setTimeout(() => {
        connectCall()
      }, 3500)
    }

    if (status === 'idle') {
      if (autoConnectRef.current) {
        clearTimeout(autoConnectRef.current)
        autoConnectRef.current = null
      }
    }

    return () => {
      if (autoConnectRef.current) clearTimeout(autoConnectRef.current)
    }
  }, [status, connectCall])

  // Listen to global tel/desk call triggers from popovers and other tables
  useEffect(() => {
    const handleGlobalDeskCall = (e: Event) => {
      e.preventDefault()
      const customEvent = e as CustomEvent
      const { phone, name, studentName: customStudentName, studentId: customStudentId } = customEvent.detail
      if (!phone) return

      const student = mockStudents.find((s) => s.phone === phone || s.parentPhone === phone)
      const finalParentName = student?.parentName || name || 'Phụ huynh'
      const finalStudentName = student?.name || customStudentName || 'Học viên'
      const finalStudentId = student?.id || customStudentId || 'unknown'

      useCallStore.getState().startCall({
        studentId: finalStudentId,
        studentName: finalStudentName,
        parentPhone: phone,
        parentName: finalParentName,
      })
      toast.info(`Đang kết nối cuộc gọi CS tới: ${finalParentName}`)
    }

    window.addEventListener('rinov5:desk-call', handleGlobalDeskCall as EventListener)
    return () => window.removeEventListener('rinov5:desk-call', handleGlobalDeskCall as EventListener)
  }, [])

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleCancelCall = () => {
    if (autoConnectRef.current) {
      clearTimeout(autoConnectRef.current)
      autoConnectRef.current = null
    }
    resetCall()
    toast.info('Đã kết thúc cuộc gọi')
  }

  // Kết thúc cuộc gọi & gom toàn bộ ghi chú tốc ký vào textarea trao đổi
  const handleEndCall = () => {
    const activeNotes = quickNotes.map((n) => n.trim()).filter(Boolean)
    if (activeNotes.length > 0) {
      setNoteText(activeNotes.map((n) => `• ${n}`).join('\n'))
    }
    endCall()
  }

  // Lưu kết quả cuộc gọi & đóng popover
  const handleSaveAndClose = () => {
    let combinedNote = noteText.trim()
    if (parentOpinionText.trim()) {
      combinedNote = combinedNote
        ? `${combinedNote}\n\nÝ kiến PH: ${parentOpinionText.trim()}`
        : `Ý kiến PH: ${parentOpinionText.trim()}`
    }
    saveCallLog(duration > 0 ? 'Đã trao đổi tốt' : 'Không nghe máy', combinedNote)
    toast.success('Đã lưu kết quả cuộc gọi thành công!')
  }

  // Never render global floating popover on student_operations_alert as it has its own embedded CallConnectionBanner section
  if (status === 'idle' || !mounted || pathname?.includes('student_operations_alert')) return null

  return createPortal(
    <DismissableLayerBranch asChild>
      <FocusScope asChild loop={false} trapped={false}>
        <div
          data-call-dialog="true"
          onPointerDown={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'call-dialog-container pointer-events-auto fixed bottom-6 right-6 z-[9999] overflow-hidden rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-lg flex flex-col transition-all duration-300 ease-in-out bg-background/98 w-[390px] sm:w-[410px] h-auto max-h-[580px]',
            status === 'dialing' && 'border-amber-300/80 dark:border-amber-800/80',
            status === 'connected' && 'border-rose-200/90 dark:border-rose-900/60',
            status === 'ended' && 'border-emerald-300/90 dark:border-emerald-800/80'
          )}
          style={{ pointerEvents: 'auto' }}
        >
          {/* ── 1. BANNER HEADER ROW: DÒNG 1 HIỂN THỊ ĐẦY ĐỦ TÊN, DÒNG 2 CHỨA TRẠNG THÁI & BADGES ── */}
          <div
            className={cn(
              'px-3.5 py-2.5 rounded-t-2xl border-b transition-colors flex items-center gap-2.5 select-none',
            status === 'dialing' &&
              'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200/70 dark:border-amber-900/50',
            status === 'connected' &&
              'bg-rose-50/80 dark:bg-rose-950/35 border-rose-200/70 dark:border-rose-900/50',
            status === 'ended' &&
              'bg-emerald-50/85 dark:bg-emerald-950/40 border-emerald-200/70 dark:border-emerald-900/50'
          )}
        >
          {/* Status Circle Icon */}
          <div
            className={cn(
              'h-7 w-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs',
              status === 'dialing' && 'bg-amber-500 animate-pulse',
              status === 'connected' && 'bg-emerald-600',
              status === 'ended' && 'bg-emerald-600'
            )}
          >
            {status === 'ended' ? (
              <Check className="h-4 w-4 stroke-[3px]" />
            ) : (
              <Phone className="h-3.5 w-3.5 fill-current" />
            )}
          </div>

          {/* Dòng 1 & Dòng 2 */}
          <div className="min-w-0 flex-1">
            {/* Dòng 1: Chiếm trọn 100% chiều ngang thẻ, không bị badges chèn ép -> KHÔNG BỊ TRUNCATE */}
            <div className="font-bold text-foreground text-xs flex items-center gap-1 flex-wrap">
              <span className="shrink-0 text-muted-foreground font-semibold">
                {status === 'dialing'
                  ? 'Đang gọi:'
                  : status === 'connected'
                  ? 'Đang kết nối:'
                  : 'Đã kết thúc với:'}
              </span>
              <span className="text-primary font-extrabold">
                {parentName || 'Phụ huynh'}
              </span>
              <span className="text-muted-foreground font-mono text-[11px] shrink-0">
                ({parentPhone})
              </span>
            </div>

            {/* Dòng 2: Trạng thái bên trái + Ghi âm/Đếm giờ dịch xuống bên phải */}
            <div className="text-[10.5px] mt-1 flex items-center justify-between gap-2">
              <div className="min-w-0">
                {status === 'dialing' ? (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold italic flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                    <span>Đang đổ chuông... Đang kết nối CRM</span>
                  </span>
                ) : status === 'connected' ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Đã kết nối thành công (Nghe máy)</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span>✓ Thời lượng:</span>
                    <span className="font-mono font-extrabold">{formatDuration(duration)}</span>
                    <span>• Đã lưu vết ghi âm</span>
                  </span>
                )}
              </div>

              {/* Badges ghi âm & đếm giờ dịch xuống dòng 2 */}
              {status === 'connected' && (
                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-200 dark:border-rose-900/80 shadow-3xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
                    <Disc className="h-3 w-3 text-rose-600 animate-spin" />
                    <span>REC</span>
                  </div>
                  <div className="font-mono text-[10.5px] font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 flex items-center gap-1 shadow-3xs">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>
              )}

              {/* Nút nghe lại ghi âm ở dòng 2 khi kết thúc */}
              {status === 'ended' && (
                <button
                  type="button"
                  onClick={() => setPlaybackIsPlaying(!playbackIsPlaying)}
                  className={cn(
                    'flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-bold border transition-all cursor-pointer shadow-3xs shrink-0 ml-auto',
                    playbackIsPlaying
                      ? 'bg-emerald-600 text-white border-emerald-700 animate-pulse'
                      : 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-200'
                  )}
                  title={playbackIsPlaying ? 'Tạm dừng nghe lại' : 'Bấm để nghe lại cuộc ghi âm'}
                >
                  {playbackIsPlaying ? (
                    <Pause className="h-3 w-3 fill-current" />
                  ) : (
                    <Play className="h-3 w-3 fill-current ml-0.5" />
                  )}
                  <span className="font-mono text-[10.5px]">
                    {playbackIsPlaying
                      ? `${formatDuration(Math.round((playbackProgress / 100) * duration))} / ${formatDuration(duration)}`
                      : formatDuration(duration)}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── 2. NỘI DUNG TƯƠNG TÁC THEO TỪNG GIAI ĐOẠN ── */}

        {/* ── GIAI ĐOẠN 1 & 2: ĐANG GỌI ĐI (DIALING) & ĐANG KẾT NỐI (CONNECTED) CHUẨN PRODUCTION ── */}
        {(status === 'dialing' || status === 'connected') && (
          <div className="p-3 flex flex-col space-y-2.5">
            {/* Học viên ở phần nội dung */}
            {studentName && (
              <div className="text-[11.5px] text-muted-foreground flex items-center gap-1.5 pb-0.5">
                <span>Học viên:</span>
                <span className="font-bold text-foreground">{studentName}</span>
              </div>
            )}

            {/* Toolbar Controls */}
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={cn(
                    'h-7 px-2.5 text-xs font-semibold rounded-md border flex items-center gap-1 transition-colors cursor-pointer',
                    isMuted
                      ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-background hover:bg-muted text-foreground border-border'
                  )}
                  title={isMuted ? 'Bật micro' : 'Tắt micro (Mute)'}
                >
                  {isMuted ? (
                    <MicOff className="h-3.5 w-3.5 text-amber-600" />
                  ) : (
                    <Mic className="h-3.5 w-3.5" />
                  )}
                  <span>{isMuted ? 'Đã tắt mic' : 'Mic'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                  className={cn(
                    'h-7 px-2.5 text-xs font-semibold rounded-md border flex items-center gap-1 transition-colors cursor-pointer',
                    !isSpeakerOn
                      ? 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
                      : 'bg-background hover:bg-muted text-foreground border-border'
                  )}
                  title={isSpeakerOn ? 'Tắt loa ngoài' : 'Bật loa ngoài'}
                >
                  {isSpeakerOn ? (
                    <Volume2 className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                  <span>{isSpeakerOn ? 'Loa ngoài' : 'Loa tắt'}</span>
                </button>
              </div>

              {/* End Call / Cancel Button */}
              <button
                type="button"
                onClick={status === 'dialing' ? handleCancelCall : handleEndCall}
                className="h-7 px-3 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs ml-auto"
                title={status === 'dialing' ? 'Hủy cuộc gọi' : 'Kết thúc cuộc gọi'}
              >
                <PhoneOff className="h-3.5 w-3.5" />
                <span>{status === 'dialing' ? 'Hủy' : 'Kết thúc'}</span>
              </button>
            </div>

            {/* Tốc ký ghi chú nhanh trong cuộc gọi */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                <span>Tốc ký ghi chú nhanh (Enter để thêm dòng):</span>
                <span className="text-[10px] text-muted-foreground/80 font-mono">
                  {quickNotes.filter((n) => n.trim()).length} ý
                </span>
              </div>

              <div className="min-h-[85px] max-h-[120px] overflow-y-auto border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl p-2 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-1 scrollbar-thin">
                {quickNotes.map((note, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-1.5 justify-between py-0.5 px-1 rounded hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition-colors"
                  >
                    <div className="flex items-start gap-1.5 flex-1 min-w-0">
                      <span className="text-emerald-500 dark:text-emerald-400 text-xs select-none mt-0.5">
                        •
                      </span>
                      <input
                        type="text"
                        value={note}
                        placeholder={
                          idx === quickNotes.length - 1
                            ? 'Nhập ghi chú nhanh (Enter thêm dòng)...'
                            : 'Ghi chú...'
                        }
                        onPointerDown={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onFocus={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const newNotes = [...quickNotes]
                          newNotes[idx] = e.target.value
                          setQuickNotes(newNotes)
                        }}
                        onKeyDown={(e) => {
                          e.stopPropagation()
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            const newNotes = [...quickNotes]
                            newNotes.splice(idx + 1, 0, '')
                            setQuickNotes(newNotes)
                            setTimeout(() => {
                              const inputs = document.querySelectorAll('.in-call-note-input')
                              const nextInput = inputs[idx + 1] as HTMLInputElement
                              if (nextInput) nextInput.focus()
                            }, 0)
                          } else if (e.key === 'Backspace' && !note && quickNotes.length > 1) {
                            e.preventDefault()
                            const newNotes = quickNotes.filter((_, i) => i !== idx)
                            setQuickNotes(newNotes)
                            setTimeout(() => {
                              const inputs = document.querySelectorAll('.in-call-note-input')
                              const prevInput = inputs[Math.max(0, idx - 1)] as HTMLInputElement
                              if (prevInput) {
                                prevInput.focus()
                                const len = prevInput.value.length
                                prevInput.setSelectionRange(len, len)
                              }
                            }, 0)
                          }
                        }}
                        className="in-call-note-input w-full bg-transparent border-none outline-none focus:ring-0 p-0 text-xs font-medium leading-relaxed text-foreground placeholder:text-muted-foreground/60 select-text"
                      />
                    </div>
                    {quickNotes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newNotes = quickNotes.filter((_, i) => i !== idx)
                          setQuickNotes(newNotes)
                        }}
                        className="text-muted-foreground hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0"
                        title="Xóa dòng này"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── GIAI ĐOẠN 3: CUỘC GỌI ĐÃ DỪNG & GHI NHẬN KẾT QUẢ (ENDED) ── */}
        {status === 'ended' && (
          <div className="p-3.5 flex flex-col space-y-2.5">
            {/* Học viên ở phần nội dung */}
            {studentName && (
              <div className="text-[11.5px] text-muted-foreground flex items-center gap-1.5 pb-0.5">
                <span>Học viên:</span>
                <span className="font-bold text-foreground">{studentName}</span>
              </div>
            )}

            {/* Ô 1: Nhập ghi chú tóm tắt nội dung trao đổi (Đã gom các ghi chú tốc ký trước đó, KHÔNG CÓ TITLE) */}
            <Textarea
              ref={noteInputRef}
              placeholder="Nhập ghi chú tóm tắt nội dung đã trao đổi..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="text-xs bg-background border border-zinc-200 dark:border-zinc-800 min-h-[75px] max-h-[110px] resize-none py-2 px-2.5 rounded-xl scrollbar-thin select-text"
            />

            {/* Ô 2: Nhập ý kiến / phản hồi của phụ huynh (KHÔNG CÓ TITLE) */}
            <Textarea
              placeholder="Nhập ý kiến / phản hồi của phụ huynh..."
              value={parentOpinionText}
              onChange={(e) => setParentOpinionText(e.target.value)}
              onPointerDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className="text-xs bg-background border border-zinc-200 dark:border-zinc-800 min-h-[60px] max-h-[90px] resize-none py-2 px-2.5 rounded-xl scrollbar-thin select-text"
            />

            {/* Hai nút hành động ở chân: Lưu kết quả cuộc gọi hoặc Đóng */}
            <div className="flex items-center gap-2 pt-1 border-t border-border/50">
              <Button
                type="button"
                className="flex-1 h-8.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                onClick={handleSaveAndClose}
              >
                <Check className="h-3.5 w-3.5 stroke-[3px]" />
                Lưu kết quả cuộc gọi
              </Button>

              <Button
                type="button"
                variant="outline"
                className="h-8.5 text-xs text-muted-foreground hover:text-foreground rounded-xl px-4 cursor-pointer"
                onClick={resetCall}
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </div>
      </FocusScope>
    </DismissableLayerBranch>,
    document.body
  )
}
