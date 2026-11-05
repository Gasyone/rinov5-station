export interface AcceptanceCriteriaItem {
  id: string
  scenario: string
  given: string
  when: string
  then: string
}

export interface CornerCaseItem {
  id: string
  code: string
  title: string
  scenario: string
  handling: string
}

export interface BusinessRuleItem {
  id: string
  code: string
  title: string
  rule: string
}

export interface DataSourceItem {
  id: string
  entity: string
  fields: string
  notes: string
}

export interface PoSectionSpec {
  id: string
  code: string
  title: string
  subtitle: string
  targetSelector: string
  intent: string
  // Form danh sách có cấu trúc — ban đầu để trống cho PO tự điền
  dataSources: DataSourceItem[]
  acceptanceCriteriaList: AcceptanceCriteriaItem[]
  cornerCasesList: CornerCaseItem[]
  businessRulesList: BusinessRuleItem[]
  poNotes: string
}

export type PoSectionId =
  | 'lead-banner'
  | 'program-select'
  | 'school-select'
  | 'nearest-centers'
  | 'schedule-date-filter'
  | 'schedule-session-list'
  | 'notes'
  | 'contact-select'
  | 'child-select'
  | 'summary-card'
  | 'sms-zns-toggle'
  | 'submit-btn'
  | 'success-view'
  | (string & {})
