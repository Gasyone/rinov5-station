'use client'

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { StudentCareWorkItem } from './careJourneyHelpers'
import { CareJourneyStepper } from './CareJourneyStepper'

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
  if (!workItem) return null

  const studentCode = workItem.studentId || workItem.studentCode || workItem.id
  const packageName = workItem.productName ? workItem.productName.split('(')[0].trim() : 'Standard 6 Tháng'

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl max-w-3xl w-[90vw] lg:w-[780px] h-[82vh] max-h-[720px] min-h-[580px] flex flex-col p-6 gap-0 bg-background border-border overflow-hidden">
        <DialogHeader className="p-0 border-b pb-3 shrink-0">
          <div>
            <DialogTitle className="text-base text-foreground flex items-center gap-1.5 flex-wrap">
              <span className="font-normal text-muted-foreground text-sm">Mốc chăm sóc:</span>
              <span className="font-semibold text-foreground">{workItem.studentName} {studentCode ? `(${studentCode})` : ''}</span>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5 flex-wrap">
              <span>Lớp: <span className="font-medium text-foreground">{workItem.className}</span></span>
              <span className="text-muted-foreground/60">•</span>
              <span>Gói: <span className="font-medium text-foreground">{packageName}</span></span>
              {workItem.expectedEndDate && (
                <>
                  <span className="text-muted-foreground/60">•</span>
                  <span>Hạn: <span className="font-medium text-foreground">{workItem.expectedEndDate}</span></span>
                </>
              )}
            </p>
          </div>
        </DialogHeader>

        {/* BODY CONTENT */}
        <div className="flex-1 min-h-0 overflow-y-auto pt-3 pb-0 pr-1 flex flex-col">
          <CareJourneyStepper workItem={workItem} isVertical={true} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

