'use client'

import { useState } from 'react'

interface ClassesStatsTrendChartProps {
  periodType: 'week' | 'month' | 'quarter' | 'custom'
  currentClassesCount: number
  currentStudentsCount: number
  currentAvgStudents: number
}

interface ChartDataPoint {
  label: string
  classCount: number
  totalStudents: number
  avgStudents: number
}

export function ClassesStatsTrendChart({
  periodType,
  currentClassesCount,
  currentStudentsCount,
  currentAvgStudents,
}: ClassesStatsTrendChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  // 1. Construct data points based on periodType
  let dataPoints: ChartDataPoint[] = []

  if (periodType === 'week') {
    dataPoints = [
      { label: 'Tuần 21', classCount: 8, totalStudents: 95, avgStudents: 11.9 },
      { label: 'Tuần 22', classCount: 9, totalStudents: 102, avgStudents: 11.3 },
      { label: 'Tuần 23', classCount: 9, totalStudents: 110, avgStudents: 12.2 },
      { label: 'Tuần 24', classCount: 10, totalStudents: 118, avgStudents: 11.8 },
      { label: 'Tuần 25', classCount: 10, totalStudents: 125, avgStudents: 12.5 },
      { label: 'Tuần 26 (HT)', classCount: currentClassesCount, totalStudents: currentStudentsCount, avgStudents: currentAvgStudents },
    ]
  } else if (periodType === 'quarter') {
    dataPoints = [
      { label: 'Q3/2025', classCount: 7, totalStudents: 75, avgStudents: 10.7 },
      { label: 'Q4/2025', classCount: 8, totalStudents: 90, avgStudents: 11.3 },
      { label: 'Q1/2026', classCount: 10, totalStudents: 115, avgStudents: 11.5 },
      { label: 'Q2/2026 (HT)', classCount: currentClassesCount, totalStudents: currentStudentsCount, avgStudents: currentAvgStudents },
    ]
  } else if (periodType === 'custom') {
    dataPoints = [
      { label: 'Lịch sử', classCount: 12, totalStudents: 130, avgStudents: 10.8 },
      { label: 'Đo lường (HT)', classCount: currentClassesCount, totalStudents: currentStudentsCount, avgStudents: currentAvgStudents },
    ]
  } else {
    // default: month
    dataPoints = [
      { label: 'Tháng 1', classCount: 8, totalStudents: 85, avgStudents: 10.6 },
      { label: 'Tháng 2', classCount: 9, totalStudents: 92, avgStudents: 10.2 },
      { label: 'Tháng 3', classCount: 9, totalStudents: 110, avgStudents: 12.2 },
      { label: 'Tháng 4', classCount: 10, totalStudents: 125, avgStudents: 12.5 },
      { label: 'Tháng 5', classCount: 11, totalStudents: 140, avgStudents: 12.7 },
      { label: 'Tháng 6 (HT)', classCount: currentClassesCount, totalStudents: currentStudentsCount, avgStudents: currentAvgStudents },
    ]
  }

  // 2. Define layout dimensions
  const svgWidth = 600
  const svgHeight = 220
  const paddingLeft = 45
  const paddingRight = 45
  const paddingTop = 25
  const paddingBottom = 30

  const plotWidth = svgWidth - paddingLeft - paddingRight
  const plotHeight = svgHeight - paddingTop - paddingBottom

  // 3. Compute scales
  const maxStudentsValue = Math.max(...dataPoints.map((d) => d.totalStudents), 100)
  const maxStudentsScale = Math.ceil(maxStudentsValue * 1.2 / 50) * 50 // round up to multiple of 50
  const maxAvgScale = 20

  const n = dataPoints.length
  const columnWidth = plotWidth / n

  // Get coordinates for plotting
  const points = dataPoints.map((d, i) => {
    const x = paddingLeft + (i + 0.5) * columnWidth
    const barHeight = (d.totalStudents / maxStudentsScale) * plotHeight
    const barY = paddingTop + plotHeight - barHeight

    const lineY = paddingTop + plotHeight - (d.avgStudents / maxAvgScale) * plotHeight

    return {
      x,
      barY,
      barHeight,
      lineY,
      data: d,
    }
  })

  // Generate line path
  const linePath = points.length > 0
    ? points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.lineY}`).join(' ')
    : ''

  return (
    <div className="relative rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-sm font-semibold text-foreground">Xu hướng số lượng học sinh & Sĩ số trung bình</h4>
          <p className="text-xs text-muted-foreground">So sánh biến động qua các chu kỳ (Cột: Tổng học sinh, Đường: Sĩ số trung bình)</p>
        </div>
        <div className="flex gap-4 text-xs shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded bg-primary/85" />
            <span className="text-muted-foreground font-medium">Tổng học sinh</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-emerald-500 relative flex items-center justify-center">
              <span className="absolute h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-muted-foreground font-medium">Sĩ số trung bình</span>
          </div>
        </div>
      </div>

      <div className="relative h-56 w-full min-w-0">
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="h-full w-full select-none" preserveAspectRatio="none">
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.85} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.2} />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
            const y = paddingTop + ratio * plotHeight
            const studentsVal = Math.round(maxStudentsScale * (1 - ratio))
            const avgVal = Math.round(maxAvgScale * (1 - ratio))

            return (
              <g key={index} className="opacity-70">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={svgWidth - paddingRight}
                  y2={y}
                  stroke="var(--border)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
                {/* Left axis label */}
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground font-mono text-[9px]"
                >
                  {studentsVal}
                </text>
                {/* Right axis label */}
                <text
                  x={svgWidth - paddingRight + 8}
                  y={y + 4}
                  textAnchor="start"
                  className="fill-muted-foreground font-mono text-[9px]"
                >
                  {avgVal}
                </text>
              </g>
            )
          })}

          {/* X-axis labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={svgHeight - 8}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] font-medium"
            >
              {p.data.label}
            </text>
          ))}

          {/* Columns (Total Students) */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={p.x - 12}
              y={p.barY}
              width={24}
              height={Math.max(p.barHeight, 2)}
              rx={3}
              fill="url(#barGradient)"
              className="transition-all duration-300"
              opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.6}
            />
          ))}

          {/* Average Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--color-success-text, #10b981)"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={hoveredIndex === null ? 0.9 : 0.6}
            />
          )}

          {/* Points on Line */}
          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.lineY}
              r={hoveredIndex === i ? 6 : 4}
              fill={hoveredIndex === i ? "var(--background)" : "#10b981"}
              stroke="#10b981"
              strokeWidth={hoveredIndex === i ? 3 : 2}
              className="transition-all duration-150"
            />
          ))}

          {/* Hover Vertical Line */}
          {hoveredIndex !== null && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + plotHeight}
              stroke="var(--primary)"
              strokeWidth={1.5}
              strokeDasharray="3 3"
              opacity={0.5}
            />
          )}

          {/* Invisible Overlay Rectangles for easy hover */}
          {points.map((p, i) => (
            <rect
              key={i}
              x={p.x - columnWidth / 2}
              y={paddingTop}
              width={columnWidth}
              height={plotHeight}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          ))}
        </svg>

        {/* Absolute Tooltip */}
        {hoveredIndex !== null && (
          <div
            className="absolute z-30 rounded-lg border border-border bg-popover p-2.5 shadow-md text-xs text-popover-foreground transition-all pointer-events-none"
            style={{
              left: `${Math.min(
                Math.max(
                  (points[hoveredIndex].x / svgWidth) * 100 - 15,
                  5
                ),
                80
              )}%`,
              top: '10px',
            }}
          >
            <p className="font-bold border-b border-border pb-1 mb-1 text-primary">
              {points[hoveredIndex].data.label}
            </p>
            <div className="space-y-0.5 font-medium">
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Tổng lớp:</span>
                <span>{points[hoveredIndex].data.classCount} lớp</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Tổng học sinh:</span>
                <span className="text-blue-500 font-semibold">{points[hoveredIndex].data.totalStudents} hs</span>
              </p>
              <p className="flex justify-between gap-4">
                <span className="text-muted-foreground">Sĩ số TB:</span>
                <span className="text-emerald-500 font-semibold">{points[hoveredIndex].data.avgStudents} hs/lớp</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
