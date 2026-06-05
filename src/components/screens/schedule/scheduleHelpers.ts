import type { ScheduleGridItem, LayoutItem } from './scheduleTypes'

const pad = (value: number) => String(value).padStart(2, '0')

export const toScheduleDateKey = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

export const getScheduleMonday = (input: Date) => {
  const date = new Date(input)
  const day = date.getDay()
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1))
  date.setHours(0, 0, 0, 0)
  return date
}

export const getScheduleWeekDays = (from: Date) =>
  Array.from({ length: 7 }, (_, index) => {
    const date = new Date(from)
    date.setDate(date.getDate() + index)
    date.setHours(0, 0, 0, 0)
    return date
  })

export const parseScheduleTime = (time: string) => {
  const [hour = 0, minute = 0] = time.split(':').map(Number)
  return hour * 60 + minute
}

export const formatMinute = (minute: number) =>
  `${pad(Math.floor(minute / 60))}:${pad(minute % 60)}`

export function layoutDayItems<T extends ScheduleGridItem>(
  dayItems: T[],
  hourStart: number,
  rowHeight: number,
  calendarMaxMinutes: number
): LayoutItem<T>[] {
  const calStart = hourStart * 60

  // 1. Map, parse times and filter items within the calendar range
  const parsed = dayItems
    .map((item) => {
      const start = Math.max(calStart, item.startMin)
      const end = Math.min(
        calendarMaxMinutes,
        parseScheduleTime(item.endTimeLabel) || item.startMin + 60
      )
      return {
        item,
        start,
        end,
      }
    })
    .filter((evt) => evt.start < evt.end)
    .sort((a, b) => a.start - b.start || a.end - b.end)

  // 2. Group into overlapping clusters
  const groups: typeof parsed[] = []
  let currentGroup: typeof parsed = []
  let groupEnd = 0

  parsed.forEach((evt) => {
    if (currentGroup.length === 0) {
      currentGroup.push(evt)
      groupEnd = evt.end
    } else if (evt.start < groupEnd) {
      currentGroup.push(evt)
      groupEnd = Math.max(groupEnd, evt.end)
    } else {
      groups.push(currentGroup)
      currentGroup = [evt]
      groupEnd = evt.end
    }
  })
  if (currentGroup.length > 0) {
    groups.push(currentGroup)
  }

  // 3. For each group, assign columns (overlapIndex)
  const laidOut: LayoutItem<T>[] = []

  groups.forEach((group) => {
    const columns: number[] = [] // stores the end time of the last event in each column of the group
    const eventCols: { evt: typeof group[0]; colIndex: number }[] = []

    group.forEach((evt) => {
      let placed = false
      for (let i = 0; i < columns.length; i++) {
        if (columns[i] <= evt.start) {
          columns[i] = evt.end
          eventCols.push({ evt, colIndex: i })
          placed = true
          break
        }
      }
      if (!placed) {
        columns.push(evt.end)
        eventCols.push({ evt, colIndex: columns.length - 1 })
      }
    })

    const totalCols = columns.length
    eventCols.forEach(({ evt, colIndex }) => {
      const startOffset = evt.start - calStart
      const duration = Math.max(15, evt.end - evt.start)
      const top = startOffset * (rowHeight / 30)
      const height = duration * (rowHeight / 30)

      // Calculate width and left percentages
      const width = 100 / totalCols
      const left = colIndex * width

      laidOut.push({
        item: evt.item,
        top,
        height,
        left,
        width,
      })
    })
  })

  return laidOut
}
