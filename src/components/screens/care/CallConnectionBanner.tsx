'use client'

import { useState, useEffect } from 'react'
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX, Disc, Check, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CallConnectionBannerProps {
  isActive: boolean
  contactName: string
  contactPhone: string
  onEndCall: () => void
  onOutcomeSelect?: (outcome: string) => void
}

export function CallConnectionBanner({
  isActive,
  contactName,
  contactPhone,
  onEndCall,
  onOutcomeSelect,
}: CallConnectionBannerProps) {
  const [callStatus, setCallStatus] = useState<'dialing' | 'connected' | 'ended'>('dialing')
  const [seconds, setSeconds] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(true)

  // Dialing -> Connected timer transition
  useEffect(() => {
    if (!isActive) {
      setCallStatus('dialing')
      setSeconds(0)
      return
    }

    setCallStatus('dialing')
    setSeconds(0)

    const connectTimeout = setTimeout(() => {
      setCallStatus('connected')
    }, 2200)

    return () => clearTimeout(connectTimeout)
  }, [isActive])

  // Live call elapsed timer when connected
  useEffect(() => {
    if (!isActive || callStatus !== 'connected') return

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, callStatus])

  if (!isActive) return null

  const formatTimer = (totalSeconds: number) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
    const secs = String(totalSeconds % 60).padStart(2, '0')
    return `${mins}:${secs}`
  }

  // Ended Call Trace Banner State (Preserved for user to write notes before saving)
  if (callStatus === 'ended') {
    return (
      <div className="w-full mt-2 p-2.5 rounded-xl border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50/80 dark:bg-emerald-950/40 text-xs shadow-2xs space-y-1.5 animate-in fade-in-50 duration-200 select-none">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Check className="h-4 w-4" />
            </div>
            <div>
              <div className="font-bold text-foreground text-xs flex items-center gap-1.5 flex-wrap">
                <span>Đã kết thúc cuộc gọi với:</span>
                <span className="text-emerald-800 dark:text-emerald-300 font-extrabold">{contactName}</span>
                <span className="text-muted-foreground font-mono text-[11px]">({contactPhone})</span>
              </div>
              <p className="text-[10.5px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5 flex-wrap">
                <span>✓ Thời lượng cuộc gọi: <span className="font-mono font-extrabold">{formatTimer(seconds || 165)}</span></span>
                <span>• Đã lưu vết file ghi âm. Nhập ghi chú & bấm <span className="underline font-bold">Lưu / Hoàn thành</span> để lưu lại.</span>
              </p>
            </div>
          </div>

          {/* Audio Recording Trace Preview */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold text-[10.5px] border border-emerald-300 dark:border-emerald-800 shadow-3xs">
              <Disc className="h-3.5 w-3.5 text-emerald-600" />
              <span>File ghi âm ({formatTimer(seconds || 165)})</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full mt-2 p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/30 text-xs shadow-2xs space-y-2 animate-in fade-in-50 duration-200 select-none">
      {/* Banner Header Row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          {/* Status Icon */}
          <div
            className={cn(
              'h-7 w-7 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs',
              callStatus === 'dialing' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-600'
            )}
          >
            <Phone className="h-3.5 w-3.5 fill-current" />
          </div>

          <div>
            <div className="font-bold text-foreground text-xs flex items-center gap-1.5 flex-wrap">
              <span>{callStatus === 'dialing' ? 'Đang gọi điện cho:' : 'Cuộc gọi đang kết nối với:'}</span>
              <span className="text-primary font-extrabold">{contactName}</span>
              <span className="text-muted-foreground font-mono text-[11px]">({contactPhone})</span>
            </div>

            <p className="text-[10.5px] text-muted-foreground font-medium">
              {callStatus === 'dialing' ? (
                <span className="text-amber-600 dark:text-amber-400 font-semibold italic flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
                  Đang đổ chuông... Đang kết nối tổng đài CRM
                </span>
              ) : (
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Đã kết nối thành công (Nghe máy)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Live Call Duration & Recording Badge */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          {callStatus === 'connected' && (
            <>
              {/* Recording Indicator */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold text-[10px] border border-rose-200 dark:border-rose-900/80">
                <span className="h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
                <Disc className="h-3 w-3 text-rose-600 animate-spin" />
                <span>REC Ghi âm</span>
              </div>

              {/* Live Timer */}
              <div className="font-mono text-xs font-extrabold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <Clock className="h-3 w-3 text-emerald-600" />
                <span>{formatTimer(seconds)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Banner Action Bar: Action Controls & Outcome Fast Select */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-rose-200/60 dark:border-rose-900/40 flex-wrap">
        {/* Action Icon Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              'h-7 px-2 text-[11px] font-semibold rounded-md border flex items-center gap-1 transition-colors cursor-pointer',
              isMuted
                ? 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950 dark:text-amber-300'
                : 'bg-background hover:bg-muted text-foreground border-border'
            )}
            title={isMuted ? 'Bật micro' : 'Tắt micro (Mute)'}
          >
            {isMuted ? <MicOff className="h-3.5 w-3.5 text-amber-600" /> : <Mic className="h-3.5 w-3.5" />}
            <span>{isMuted ? 'Đã tắt mic' : 'Mic'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={cn(
              'h-7 px-2 text-[11px] font-semibold rounded-md border flex items-center gap-1 transition-colors cursor-pointer',
              !isSpeakerOn
                ? 'bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300'
                : 'bg-background hover:bg-muted text-foreground border-border'
            )}
            title={isSpeakerOn ? 'Tắt loa ngoài' : 'Bật loa ngoài'}
          >
            {isSpeakerOn ? <Volume2 className="h-3.5 w-3.5 text-primary" /> : <VolumeX className="h-3.5 w-3.5 text-muted-foreground" />}
            <span>{isSpeakerOn ? 'Loa ngoài' : 'Loa tắt'}</span>
          </button>
        </div>

        {/* End Call Button */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button"
            onClick={() => {
              if (onOutcomeSelect) onOutcomeSelect('nghe_may')
              setCallStatus('ended')
            }}
            className="h-7 px-3 text-[11px] font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            title="Kết thúc cuộc gọi và lưu vết"
          >
            <PhoneOff className="h-3.5 w-3.5" />
            <span>Kết thúc</span>
          </button>
        </div>
      </div>
    </div>
  )
}
