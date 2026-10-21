export interface DocumentLink {
  label: string
  url: string
}

export interface ExplainTopic {
  id: string
  title: string
  category: string
  badgeLabel?: string
  targetSelector?: string
  targetText?: string
  what: string
  why: string
  who: string
  rules: string[]
  documentLinks?: DocumentLink[]
  userStory?: string
  businessFunction?: string
  createdAt?: string
  updatedAt?: string
}
