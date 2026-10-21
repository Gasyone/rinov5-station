import type { ScreenTourConfig } from '../explainTourTypes'
import { STUDENT_OPERATIONS_ALERT_TOUR } from './studentOperationsAlertTour'

export const SCREEN_TOURS: Record<string, ScreenTourConfig> = {
  student_operations_alert: STUDENT_OPERATIONS_ALERT_TOUR,
}

export function getTourForPathname(pathname: string | null): ScreenTourConfig | null {
  if (!pathname) return null
  const menuId = pathname.replace(/^\/app\//, '').split('/')[0]
  return SCREEN_TOURS[menuId] || null
}
