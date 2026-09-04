'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { ChevronRight, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProgramLevelTreeProps {
  selectedPrograms: Set<string>
  selectedLevels: Set<string>
  onToggleProgram: (programId: string) => void
  onToggleLevel: (levelId: string) => void
}

interface ProgramNode {
  id: string
  name: string
  subject: string
  levels: { id: string; name: string }[]
}

export const PROGRAM_TREE: ProgramNode[] = [
  {
    id: 'tieng_anh',
    name: 'Chương trình Tiếng Anh',
    subject: 'Tiếng Anh',
    levels: [
      { id: 'Level 0', name: 'Level 0 (Kindy)' },
      { id: 'Level 1', name: 'Level 1 (Starters)' },
      { id: 'Level 2', name: 'Level 2 (Movers)' },
      { id: 'Level 4', name: 'Level 4 (Flyers)' },
      { id: 'Level 5', name: 'Level 5 (Tutor 1:1)' },
      { id: 'English Level 4', name: 'English Level 4' },
      { id: 'English Tutor Level 4', name: 'English Tutor Level 4' },
    ],
  },
  {
    id: 'toan_tu_duy',
    name: 'Chương trình Toán Tư duy',
    subject: 'Toán tư duy',
    levels: [
      { id: 'Einstein 0', name: 'Einstein 0 (Tiền tiểu học)' },
      { id: 'Archimedes 1', name: 'Archimedes 1 (Lớp 1)' },
      { id: 'Archimedes 2', name: 'Archimedes 2 (Lớp 2)' },
      { id: 'Archimedes 3', name: 'Archimedes 3 (Lớp 3)' },
      { id: 'Archimedes 4', name: 'Archimedes 4 (Lớp 4)' },
      { id: 'Archimedes 5', name: 'Archimedes 5 (Lớp 5)' },
      { id: 'Toán 1:6', name: 'Toán 1:6 (Nhóm nhỏ)' },
    ],
  },
]

export function ProgramLevelTreeFilter({
  selectedPrograms,
  selectedLevels,
  onToggleProgram,
  onToggleLevel,
}: ProgramLevelTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())

  const toggleExpand = (programId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(programId)) {
        next.delete(programId)
      } else {
        next.add(programId)
      }
      return next
    })
  }

  const handleProgramCheck = (program: ProgramNode) => {
    const isCurrentlySelected = selectedPrograms.has(program.id)
    onToggleProgram(program.id)

    // When checking program, automatically expand the treeview to show levels
    if (!isCurrentlySelected) {
      setExpandedNodes((prev) => new Set([...prev, program.id]))
    }
  }

  return (
    <div className="space-y-1 select-none pt-0.5">
      {PROGRAM_TREE.map((program) => {
        const isProgramSelected = selectedPrograms.has(program.id)
        const selectedChildrenCount = program.levels.filter((lvl) => selectedLevels.has(lvl.id)).length
        const allChildrenSelected = selectedChildrenCount === program.levels.length && program.levels.length > 0
        const isIndeterminate = selectedChildrenCount > 0 && !allChildrenSelected && !isProgramSelected

        // Auto expand when checked or has checked children or manually expanded
        const isExpanded = expandedNodes.has(program.id) || isProgramSelected || selectedChildrenCount > 0

        return (
          <div key={program.id} className="py-0.5">
            {/* Parent Program Row (Flat, no card border box) */}
            <div className="flex items-center justify-between py-1.5 px-1 rounded-md hover:bg-accent/60 transition-colors">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => toggleExpand(program.id)}
                  className="h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground rounded transition-transform shrink-0"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                <Checkbox
                  id={`prog-${program.id}`}
                  checked={isProgramSelected || allChildrenSelected ? true : isIndeterminate ? 'indeterminate' : false}
                  onCheckedChange={() => handleProgramCheck(program)}
                />

                <label
                  htmlFor={`prog-${program.id}`}
                  className="text-xs font-bold text-foreground cursor-pointer truncate flex-1 select-none"
                >
                  {program.name}
                </label>
              </div>

              {selectedChildrenCount > 0 && !isProgramSelected && (
                <span className="text-xs font-semibold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full shrink-0">
                  {selectedChildrenCount}/{program.levels.length}
                </span>
              )}
            </div>

            {/* Indented Child Level Nodes (Flat treeview with subtle left guide line) */}
            {isExpanded && (
              <div className="pl-6 pr-1 py-1 space-y-0.5 border-l-2 border-border/40 ml-3.5 mt-0.5 mb-1">
                {program.levels.map((level) => {
                  const isChecked = selectedLevels.has(level.id) || isProgramSelected
                  return (
                    <label
                      key={level.id}
                      className="flex items-center gap-2.5 py-1 px-2 rounded-md hover:bg-accent/60 cursor-pointer transition-colors text-xs select-none"
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => onToggleLevel(level.id)}
                      />
                      <span
                        className={cn(
                          'truncate text-xs',
                          isChecked ? 'text-foreground font-semibold' : 'text-muted-foreground'
                        )}
                      >
                        {level.name}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
