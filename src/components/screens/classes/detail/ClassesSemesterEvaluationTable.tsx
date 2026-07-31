'use client'

import React from 'react'
import { Info, Pencil } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { RosterStudent } from './classesDetailTypes'
import { getAvatarColor, getInitials } from './classesSessionDetailHelpers'
import {
  type SemesterStudentEval,
  splitStudentName,
} from './classesSemesterEvaluationHelpers'

interface ClassesSemesterEvaluationTableProps {
  displayedStudents: RosterStudent[]
  evalMap: Record<string, SemesterStudentEval>
  onEditStudent: (studentId: string) => void
}

export function ClassesSemesterEvaluationTable({
  displayedStudents,
  evalMap,
  onEditStudent,
}: ClassesSemesterEvaluationTableProps) {
  return (
    <div className="flex-1 overflow-auto p-6 bg-white dark:bg-zinc-950">
      <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800 z-10">
            <tr>
              <th className="py-3 px-4 font-bold text-zinc-600 dark:text-zinc-400">Student Name</th>
              <th className="py-3 px-4 font-bold text-zinc-600 dark:text-zinc-400">Attitude / Ý thức</th>
              <th className="py-3 px-4 font-bold text-zinc-600 dark:text-zinc-400">Knowledge / Kiến thức</th>
              <th className="py-3 px-4 font-bold text-zinc-600 dark:text-zinc-400">Skills / Kỹ năng</th>
              <th className="py-3 px-4 font-bold text-zinc-600 dark:text-zinc-400">Interaction / Tương tác</th>
              <th className="py-3 px-4 font-bold text-zinc-600 dark:text-zinc-400 text-center w-[100px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
            {displayedStudents.map((student) => {
              const ev = evalMap[student.id]
              const { english, vietnamese } = splitStudentName(student.name)

              return (
                <tr
                  key={student.id}
                  className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Info className="h-4 w-4 text-cyan-500 fill-cyan-500/10 shrink-0" />
                      <div className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 overflow-hidden",
                        getAvatarColor(student.id)
                      )}>
                        {student.avatar ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={student.avatar} alt={student.name} className="h-full w-full object-cover" />
                        ) : (
                          getInitials(student.name)
                        )}
                      </div>
                      <div>
                        {vietnamese ? (
                          <>
                            <p className="font-bold text-zinc-900 dark:text-zinc-100 leading-snug max-w-[120px] break-words whitespace-normal mb-0.5">{english}</p>
                            <p className="font-semibold text-blue-600 dark:text-blue-400 leading-snug max-w-[120px] break-words whitespace-normal">{vietnamese}</p>
                          </>
                        ) : (
                          <p className="font-semibold text-blue-600 dark:text-blue-400 leading-snug max-w-[120px] break-words whitespace-normal">{english}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {ev?.conductRating ? `${ev.conductRating}/5` : <span className="text-zinc-300 dark:text-zinc-700 font-normal">—</span>}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {ev?.knowledgeRating ? `${ev.knowledgeRating}/5` : <span className="text-zinc-300 dark:text-zinc-700 font-normal">—</span>}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {ev?.skillsRating ? `${ev.skillsRating}/5` : <span className="text-zinc-300 dark:text-zinc-700 font-normal">—</span>}
                  </td>
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                    {ev?.interactionRating ? `${ev.interactionRating}/5` : <span className="text-zinc-300 dark:text-zinc-700 font-normal">—</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <Button
                        type="button"
                        size="icon"
                        className="h-8 w-8 bg-sky-500 hover:bg-sky-600 text-white rounded-full p-0 flex items-center justify-center shadow-xs cursor-pointer border-0"
                        onClick={() => onEditStudent(student.id)}
                        title="Edit evaluation"
                      >
                        <Pencil className="h-3.5 w-3.5 text-white" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
