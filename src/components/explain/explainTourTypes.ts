export interface TourStep {
  id: string
  title: string
  category: string
  badgeLabel?: string
  /**
   * Selector CSS để tìm phần tử trên DOM, hoặc một hàm tùy biến trả về HTMLElement
   */
  targetSelector: string
  what: string
  why: string
  who: string
  rules: string[]
  userStory?: string
  businessFunction?: string
  placement?: 'bottom' | 'top' | 'left' | 'right' | 'auto'
}

export interface ScreenTourConfig {
  screenId: string
  screenTitle: string
  steps: TourStep[]
}
