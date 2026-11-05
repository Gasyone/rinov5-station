export interface VideoStep {
  time: string
  seconds: number
  title: string
  description?: string
}

export interface TutorialVideo {
  id: string
  title: string
  description: string
  youtubeId: string
  youtubeUrl: string
  thumbnailUrl: string
  views: number
  viewsText: string
  duration: string
  screenIds: string[] // List of matching screen IDs, or 'global'
  category: string
  author: string
  publishedDate: string
  badgeText?: string
  isFeatured?: boolean
  steps: VideoStep[]
}
