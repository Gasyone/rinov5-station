'use client'

import React, { useState } from 'react'
import { MapPin, List, Columns } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StudentCareWorkItem } from './careJourneyHelpers'
import { CareJourneyStepper } from './CareJourneyStepper'
import { CareHorizontalJourneyTimeline } from './CareHorizontalJourneyTimeline'

interface CareJourneyModalProps {
  isOpen: boolean
  onClose: () => void
  workItem: StudentCareWorkItem | null
}

export const CareJourneyModal: React.FC<CareJourneyModalProps> = ({
  isOpen,
  onClose,
  workItem,
}) => {
  const [layoutMode, setLayoutMode] = useState<'horizontal' | 'vertical'>('horizontal')

  if (!workItem) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-6xl max-w-6xl w-[94vw] lg:w-[1150px] h-[82vh] max-h-[720px] min-h-[580px] flex flex-col p-6 gap-0 bg-background border-border overflow-hidden">
        <DialogHeader className="p-0 flex flex-row items-center justify-between border-b pb-3 gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <span>Lộ trình Chăm sóc & Hành trình Học tập 6 Tháng</span>
                <span className="text-[11px] font-normal text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                  Gói {workItem.productName ? workItem.productName.split('(')[0] : 'Standard 6 Tháng'}
                </span>
              </DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Học viên: <strong className="text-foreground">{workItem.studentName}</strong> ({workItem.studentId || workItem.studentCode || workItem.id}) • Lớp: <span className="font-semibold text-foreground">{workItem.className}</span>
              </p>
            </div>
          </div>

          {/* VIEW MODE TOGGLE BUTTONS */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setLayoutMode('horizontal')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'horizontal'
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Columns className="h-3.5 w-3.5" />
              <span>Nằm ngang</span>
            </button>

            <button
              type="button"
              onClick={() => setLayoutMode('vertical')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                layoutMode === 'vertical'
                  ? 'text-foreground bg-muted/60'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Dạng dọc</span>
            </button>
          </div>
        </DialogHeader>

        {/* BODY CONTENT */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-3 pb-0 pr-1 flex flex-col">
          {layoutMode === 'horizontal' ? (
            <CareHorizontalJourneyTimeline workItem={workItem} />
          ) : (
            <CareJourneyStepper workItem={workItem} isVertical={true} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
