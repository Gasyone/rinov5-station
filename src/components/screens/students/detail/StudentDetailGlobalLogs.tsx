'use client'

import type { StudentGlobalLog } from './studentDetailTypes'
import { ShieldCheck } from 'lucide-react'

interface StudentDetailGlobalLogsProps {
  logs: StudentGlobalLog[]
}

export function StudentDetailGlobalLogs({ logs }: StudentDetailGlobalLogsProps) {
  return (
    <div className="relative border-l border-border pl-6 ml-3 space-y-6 pt-1">
      {logs.map((log) => (
        <div key={log.id} className="relative text-xs">
          {/* Timeline Dot */}
          <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border bg-background flex items-center justify-center ring-4 ring-background">
            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
          </div>
          
          {/* Timestamp */}
          <div className="text-[10px] text-muted-foreground font-mono font-semibold">
            {log.timestamp}
          </div>
          
          {/* Log Details */}
          <p className="text-xs font-bold text-foreground mt-1 leading-relaxed">
            {log.action}
          </p>
          
          {/* Operator */}
          <div className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Người thực hiện: <strong className="text-foreground">{log.operator}</strong></span>
          </div>
        </div>
      ))}
    </div>
  )
}
