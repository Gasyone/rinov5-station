'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { LeaveReserveRequest } from '@/mocks/leaveReserve'

interface LeaveReserveReasonDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  request: LeaveReserveRequest | null
  onConfirm: (id: string, reason: string) => void
  mode: 'cancel' | 'reject'
}

export function LeaveReserveReasonDialog({
  open,
  onOpenChange,
  request,
  onConfirm,
  mode,
}: LeaveReserveReasonDialogProps) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!request) return null

  const handleClose = () => {
    setReason('')
    setError('')
    onOpenChange(false)
  }

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError(mode === 'cancel' ? 'Vui lòng nhập lý do hủy duyệt' : 'Vui lòng nhập lý do không duyệt')
      return
    }
    onConfirm(request.id, reason)
    handleClose()
  }

  const formatRequestDate = (dateStr: string, hasSpace: boolean = true) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']
    const dayName = days[d.getDay()]
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yyyy = d.getFullYear()
    return `${dayName}${hasSpace ? ', ' : ','}${dd}/${mm}/${yyyy}`
  }

  // Read quota and absence data from the request
  const absentCount = request.usedAbsences ?? 0
  const quotaCount = request.quota ?? 12

  const titleText = mode === 'cancel' 
    ? `LÝ DO HỦY DUYỆT: ${request.id}` 
    : `LÝ DO KHÔNG DUYỆT: ${request.id}`

  const labelText = mode === 'cancel' 
    ? 'Lý do hủy duyệt:' 
    : 'Lý do không duyệt:'

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(true); }}>
      <DialogContent className="max-w-2xl bg-card border-none rounded-xl p-6" showCloseButton={false}>
        <div className="text-center py-2">
          <DialogTitle asChild>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-150 uppercase">
              {titleText}
            </h2>
          </DialogTitle>
        </div>
        
        <hr className="border-zinc-200/80 dark:border-zinc-800/80 -mx-6 my-2" />

        {/* Only show metrics for Leave (Nghỉ phép) requests */}
        {request.type === 'off' && (
          <div className="flex gap-4 justify-center my-2">
            <div className="bg-zinc-100/80 dark:bg-zinc-900/50 px-8 py-3 rounded-md text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Đã nghỉ: <span className="text-red-500 font-bold">{absentCount}</span> buổi
            </div>
            <div className="bg-zinc-100/80 dark:bg-zinc-900/50 px-8 py-3 rounded-md text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Quota: <span className="text-red-500 font-bold">{quotaCount}</span> buổi
            </div>
          </div>
        )}

        <div className="space-y-4 px-2 my-2">
          {request.type === 'learn_again' ? (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 w-32 shrink-0">Ngày đi học lại:</span>
                <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold px-2 py-1 rounded text-xs">
                  {formatRequestDate(request.startDate, true)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 w-32 shrink-0">Lớp học quay lại:</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                  {request.className} <span className="text-xs text-muted-foreground font-normal">({request.classCode})</span>
                </span>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 w-32 shrink-0 pt-0.5">Lý do đi học lại:</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {request.reason || 'Không có lý do chi tiết'}
                </span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 w-32 shrink-0">Ngày nghỉ:</span>
                {request.type === 'off' ? (
                  <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold px-2 py-1 rounded text-xs">
                    {formatRequestDate(request.startDate, true)} 18:00-19:50
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 text-sm text-zinc-700 dark:text-zinc-300 font-bold">
                    <span>từ</span>
                    <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-1 rounded text-xs">
                      {formatRequestDate(request.startDate, false)}
                    </span>
                    <span>đến</span>
                    <span className="bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 px-2 py-1 rounded text-xs">
                      {formatRequestDate(request.endDate, false)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-start gap-2">
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 w-32 shrink-0 pt-0.5">Lý do con nghỉ:</span>
                <span className="text-sm text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed">
                  {request.reason || 'Không có lý do chi tiết'}
                </span>
              </div>
            </>
          )}


          <div className="space-y-2 pt-2">
            <label className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block">{labelText}</label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (e.target.value.trim()) setError('')
              }}
              placeholder="Nhập lý do"
              className="w-full bg-zinc-100/80 dark:bg-zinc-900/40 border-0 border-b-[3px] border-pink-600 focus:border-pink-700 rounded-t-md p-3 text-sm min-h-[90px] outline-none transition-colors placeholder:text-zinc-400 font-sans"
            />
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-pink-600 text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:text-pink-700 px-8 py-2 font-semibold text-xs tracking-wider rounded-md uppercase border-2 h-10"
          >
            Thoát
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-2 font-semibold text-xs tracking-wider rounded-md uppercase h-10 border-none shadow-md hover:shadow-lg transition-all"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
