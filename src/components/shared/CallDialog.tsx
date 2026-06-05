'use client'

import { useEffect, useState, useRef } from 'react'
import { Phone, PhoneOff, Volume2, Mic, MicOff, Grid, Check, X } from 'lucide-react'
import { useCallStore } from '@/stores/useCallStore'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { mockStudents } from '@/mocks/students'

export function CallDialog() {
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
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [isKeypadOpen, setIsKeypadOpen] = useState(false)

  // Call Logging Form State
  const [selectedStatus, setSelectedStatus] = useState('Đã gọi thành công')
  const [noteText, setNoteText] = useState('')

  // In-Call Live Bullet Notes list - initialized with one empty line representing the first bullet point input
  const [quickNotes, setQuickNotes] = useState<string[]>([''])

  // State adjustment during render when studentId changes to prevent stale UI and satisfy react hooks rule
  const [lastStudentId, setLastStudentId] = useState<string | null>(null)
  if (studentId !== lastStudentId) {
    setLastStudentId(studentId)
    setIsMuted(false)
    setIsSpeakerOn(false)
    setIsKeypadOpen(false)
    setSelectedStatus('Đã gọi thành công')
    setNoteText('')
    setQuickNotes([''])
  }

  // Adjust states on phase status changes
  const [lastStatus, setLastStatus] = useState<typeof status>('idle')
  if (status !== lastStatus) {
    setLastStatus(status)
    if (status === 'ended') {
      const activeNotes = quickNotes.map(n => n.trim()).filter(Boolean)
      setQuickNotes(activeNotes)
      const joined = activeNotes.map(n => `• ${n}`).join('\n')
      setNoteText(joined)
    }
    if (status === 'dialing') {
      setQuickNotes([''])
    }
  }

  // Dialing simulation timeout ref
  const autoConnectRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-connect call after 3 seconds for demonstration convenience
  useEffect(() => {
    if (status === 'dialing') {
      autoConnectRef.current = setTimeout(() => {
        connectCall()
        toast.success('Cuộc gọi đã được kết nối (giả lập)')
      }, 3000)
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
      e.preventDefault() // <--- Ngăn chặn trình duyệt mở hộp thoại tel: hệ thống
      const customEvent = e as CustomEvent
      const { phone, name, studentName, studentId: customStudentId } = customEvent.detail
      if (!phone) return

      // Lookup student in mock data by parent phone or student phone
      const student = mockStudents.find(s => s.phone === phone || s.parentPhone === phone)

      const finalParentName = student?.parentName || name || 'Phụ huynh'
      const finalStudentName = student?.name || studentName || 'Học viên'
      const finalStudentId = student?.id || customStudentId || 'unknown'

      useCallStore.getState().startCall({
        studentId: finalStudentId,
        studentName: finalStudentName,
        parentPhone: phone,
        parentName: finalParentName,
      })
      toast.info(`Đang kết nối cuộc gọi CSKH tới: ${finalParentName}`)
    }

    window.addEventListener('rinov5:desk-call', handleGlobalDeskCall as EventListener)
    return () => window.removeEventListener('rinov5:desk-call', handleGlobalDeskCall as EventListener)
  }, [])

  if (status === 'idle') return null

  // Format seconds to mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleManualAccept = () => {
    if (autoConnectRef.current) {
      clearTimeout(autoConnectRef.current)
      autoConnectRef.current = null
    }
    connectCall()
    toast.success('Cuộc gọi được kết nối!')
  }

  const handleSave = () => {
    saveCallLog(selectedStatus, noteText)
    toast.success('Đã lưu kết quả cuộc gọi thành công!')
  }

  return (
    <>
      {/* Custom Styles for Ripples and Equalizer */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes ripple {
            0% { transform: scale(0.85); opacity: 0.8; }
            50% { opacity: 0.4; }
            100% { transform: scale(1.6); opacity: 0; }
          }
          @keyframes equalizer {
            0%, 100% { height: 6px; }
            50% { height: 32px; }
          }
          .animate-call-ripple-1 {
            animation: ripple 2.2s infinite ease-out;
          }
          .animate-call-ripple-2 {
            animation: ripple 2.2s infinite ease-out 0.7s;
          }
          .animate-eq-1 { animation: equalizer 0.8s infinite ease-in-out; }
          .animate-eq-2 { animation: equalizer 0.5s infinite ease-in-out 0.1s; }
          .animate-eq-3 { animation: equalizer 0.7s infinite ease-in-out 0.2s; }
          .animate-eq-4 { animation: equalizer 0.6s infinite ease-in-out 0.15s; }
          .animate-eq-5 { animation: equalizer 0.9s infinite ease-in-out 0.05s; }
        `
      }} />

      {/* Floating Card container */}
      <div className={`fixed bottom-6 right-6 z-[9999] w-[350px] overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-background/95 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] backdrop-blur-lg flex flex-col transition-all duration-300 ${
        status === 'ended' ? 'h-[480px]' : ''
      }`}>
        
        {/* Color Accent Bar */}
        <div className={`h-1.5 w-full ${
          status === 'dialing' ? 'bg-amber-500 animate-pulse' :
          status === 'connected' ? 'bg-emerald-500' : 'bg-indigo-500'
        }`} />

        {/* --- PHASE 1: DIALING / RINGING --- */}
        {status === 'dialing' && (
          <div className="p-6 flex flex-col items-center justify-between min-h-[380px] text-center">
            <div className="w-full flex justify-between items-center text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-amber-500">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                Đang gọi đi...
              </span>
              <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px]">VoIP</span>
            </div>

            {/* Ripple Pulse Animation Avatar */}
            <div className="relative my-8 flex items-center justify-center h-28 w-28">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-call-ripple-1" />
              <div className="absolute inset-0 rounded-full bg-primary/15 animate-call-ripple-2" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {studentName ? studentName.split(' ').pop()?.charAt(0) : 'H'}
              </div>
            </div>

            {/* Caller Info */}
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-foreground">{parentName || 'Phụ huynh'}</h3>
              <p className="text-xs text-muted-foreground font-medium">Học viên: <span className="text-foreground font-semibold">{studentName}</span></p>
              <div className="text-xl font-mono font-bold tracking-wider text-primary mt-2">{parentPhone}</div>
              <span className="text-[10px] text-muted-foreground block italic mt-1">Sẽ tự động nhấc máy sau 3 giây...</span>
            </div>

            {/* Calling Action Buttons */}
            <div className="flex items-center gap-8 mt-6">
              <button
                onClick={resetCall}
                title="Hủy cuộc gọi"
                className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <PhoneOff className="h-5 w-5" />
              </button>

              <button
                onClick={handleManualAccept}
                title="Giả lập Nhấc máy"
                className="h-12 w-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg animate-bounce transition-transform hover:scale-105 active:scale-95"
              >
                <Phone className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {/* --- PHASE 2: CONNECTED / ACTIVE CALL --- */}
        {status === 'connected' && (
          <div className="p-6 flex flex-col items-center justify-between min-h-[465px] text-center">
            <div className="w-full flex justify-between items-center text-xs text-muted-foreground font-semibold">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Đang kết nối
              </span>
              <div className="flex items-center gap-1.5">
                <span className="flex items-center gap-1 bg-red-50 dark:bg-red-950/20 text-red-600 font-bold px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider select-none">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  REC
                </span>
                <span className="font-mono text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded text-[10px]">
                  {formatDuration(duration)}
                </span>
              </div>
            </div>

            {/* Audio Waves Sound Waveform visualizer */}
            <div className="relative my-4 flex items-center justify-center gap-1.5 h-16">
              <span className="w-1.5 rounded-full bg-emerald-500 animate-eq-1" style={{ height: '12px' }} />
              <span className="w-1.5 rounded-full bg-indigo-500 animate-eq-2" style={{ height: '24px' }} />
              <span className="w-1.5 rounded-full bg-purple-500 animate-eq-3" style={{ height: '32px' }} />
              <span className="w-1.5 rounded-full bg-emerald-500 animate-eq-4" style={{ height: '20px' }} />
              <span className="w-1.5 rounded-full bg-indigo-500 animate-eq-5" style={{ height: '8px' }} />
            </div>

            {/* Caller Info */}
            <div className="space-y-0.5">
              <h3 className="text-base font-bold text-foreground">{parentName || 'Phụ huynh'}</h3>
              <p className="text-[11px] text-muted-foreground font-medium">Học viên: <span className="font-semibold text-foreground">{studentName}</span></p>
              <div className="text-base font-mono font-bold tracking-wider text-muted-foreground">{parentPhone}</div>
            </div>

            {/* VoIP Toggle buttons */}
            <div className="flex items-center gap-4 mt-3 w-full justify-center">
              <Button
                variant={isMuted ? 'default' : 'outline'}
                size="icon"
                onClick={() => setIsMuted(!isMuted)}
                className={`rounded-full h-9 w-9 shrink-0 ${isMuted ? 'bg-zinc-600 text-white hover:bg-zinc-700' : ''}`}
                title={isMuted ? "Bật Mic" : "Tắt Mic"}
              >
                {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>

              <Button
                variant={isSpeakerOn ? 'default' : 'outline'}
                size="icon"
                onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                className={`rounded-full h-9 w-9 shrink-0 ${isSpeakerOn ? 'bg-zinc-600 text-white hover:bg-zinc-700' : ''}`}
                title="Loa ngoài"
              >
                <Volume2 className="h-4 w-4" />
              </Button>

              <Button
                variant={isKeypadOpen ? 'default' : 'outline'}
                size="icon"
                onClick={() => setIsKeypadOpen(!isKeypadOpen)}
                className={`rounded-full h-9 w-9 shrink-0 ${isKeypadOpen ? 'bg-zinc-600 text-white hover:bg-zinc-700' : ''}`}
                title="Bàn phím"
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>

            {/* Dialpad mockup */}
            {isKeypadOpen && (
              <div className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-lg p-1.5 mt-1.5 w-full animate-fade-in">
                Bàn phím số khả dụng trong phiên bản thật.
              </div>
            )}

            {/* In-Call In-Place Editable Bullet Notes (Enhanced Feature) */}
            <div className="w-full mt-3 text-left border-t border-zinc-100 dark:border-zinc-800/80 pt-3 flex-1 flex flex-col min-h-0">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                  Ghi chú trong cuộc gọi {quickNotes.filter(n => n.trim()).length > 0 && `(${quickNotes.filter(n => n.trim()).length})`}
                </label>
                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-normal normal-case">
                  Nhấn Enter để xuống dòng
                </span>
              </div>

              {/* Scrollable list of in-place editable inputs */}
              <div className="flex-1 min-h-[100px] max-h-[140px] overflow-y-auto mb-2 border border-dashed border-zinc-200 dark:border-zinc-850 rounded-lg p-2.5 bg-zinc-50/50 dark:bg-zinc-950/20 space-y-1.5 scrollbar-thin">
                <div className="space-y-1">
                  {quickNotes.map((note, idx) => (
                    <div
                      key={idx}
                      className="group flex items-start gap-1.5 justify-between py-0.5 px-1.5 rounded hover:bg-zinc-100/50 dark:hover:bg-zinc-800/20 transition-colors"
                    >
                      <div className="flex items-start gap-1.5 flex-1 min-w-0">
                        <span className="text-emerald-500 dark:text-emerald-400 mt-1 text-xs select-none">•</span>
                        <input
                          type="text"
                          value={note}
                          placeholder={idx === quickNotes.length - 1 ? "Nhập ghi chú nhanh..." : "Ghi chú..."}
                          onChange={(e) => {
                            const newNotes = [...quickNotes]
                            newNotes[idx] = e.target.value
                            setQuickNotes(newNotes)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              // Add a new blank bullet point right after this one
                              const newNotes = [...quickNotes]
                              newNotes.splice(idx + 1, 0, '')
                              setQuickNotes(newNotes)
                              // Focus the new input in the next tick
                              setTimeout(() => {
                                const inputs = document.querySelectorAll('.in-call-note-input')
                                const nextInput = inputs[idx + 1] as HTMLInputElement
                                if (nextInput) nextInput.focus()
                              }, 0)
                            } else if (e.key === 'Backspace' && !note && quickNotes.length > 1) {
                              e.preventDefault()
                              // Remove this line and focus the previous one
                              const newNotes = quickNotes.filter((_, i) => i !== idx)
                              setQuickNotes(newNotes)
                              setTimeout(() => {
                                const inputs = document.querySelectorAll('.in-call-note-input')
                                const prevInput = inputs[Math.max(0, idx - 1)] as HTMLInputElement
                                if (prevInput) {
                                  prevInput.focus()
                                  // Put cursor at the end of the text
                                  const len = prevInput.value.length
                                  prevInput.setSelectionRange(len, len)
                                }
                              }, 0)
                            }
                          }}
                          className="in-call-note-input w-full bg-transparent border-none outline-none focus:ring-0 focus:outline-none p-0 text-[11px] font-medium leading-relaxed text-zinc-700 dark:text-zinc-300 placeholder:text-zinc-400/80"
                        />
                      </div>
                      {quickNotes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newNotes = quickNotes.filter((_, i) => i !== idx)
                            setQuickNotes(newNotes)
                          }}
                          className="text-zinc-400 hover:text-red-500 transition-colors mt-0.5 opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
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

            {/* Hangup Button */}
            <button
              onClick={endCall}
              className="mt-4 w-full py-2.5 px-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 text-xs"
            >
              <PhoneOff className="h-3.5 w-3.5" />
              Kết thúc cuộc gọi
            </button>
          </div>
        )}

        {/* --- PHASE 3: CALL ENDED / LOG NOTE FORM --- */}
        {status === 'ended' && (
          <div className="p-5 flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex justify-between items-center text-xs text-muted-foreground font-semibold border-b pb-2 border-zinc-100 dark:border-zinc-800">
              <span className="flex items-center gap-1.5 uppercase tracking-wider text-indigo-500">
                Cuộc gọi đã dừng
              </span>
              <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded text-[10px]">
                Thời lượng: {formatDuration(duration)}
              </span>
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-foreground">Ghi nhận phản hồi cuộc gọi</h4>
              <p className="text-[11px] text-muted-foreground">Lưu lịch sử chăm sóc học viên: <strong className="text-foreground">{studentName}</strong></p>
            </div>

            {/* Form Fields */}
            <div className="flex-1 flex flex-col gap-2.5 min-h-0">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Kết quả cuộc gọi</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full text-xs rounded-lg border border-zinc-200 dark:border-zinc-800 bg-background px-3 py-1.5 text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
                >
                  <option value="Đã gọi thành công">Đã gọi thành công / Trao đổi tốt</option>
                  <option value="Không nhấc máy">Không nghe máy (KNM)</option>
                  <option value="Máy bận">Máy bận / Số bận</option>
                  <option value="Hẹn gọi lại sau">Hẹn gọi lại sau</option>
                  <option value="Số điện thoại sai">Số điện thoại không đúng</option>
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-1 min-h-0">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex justify-between">
                  <span>Ghi chú cuộc gọi</span>
                  {quickNotes.length > 0 && (
                    <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-semibold normal-case">
                      Tổng hợp: {quickNotes.length} dòng ghi chú
                    </span>
                  )}
                </label>
                <Textarea
                  placeholder="Nhập nội dung trao đổi, phản hồi của phụ huynh hoặc lý do..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="text-xs bg-background border border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 flex-1 min-h-0 resize-none overflow-y-auto scrollbar-thin py-1.5 px-2.5"
                />
              </div>
            </div>

            {/* Form Footer Action buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs h-8"
                onClick={resetCall}
              >
                Bỏ qua
              </Button>
              <Button
                size="sm"
                className="flex-1 text-xs h-8 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={handleSave}
              >
                <Check className="h-3.5 w-3.5 mr-1" />
                Lưu kết quả
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
