export interface TrialContactChild {
  id: string
  name: string
  dob?: string
  targetSubject?: string
  branch?: string
  isFromLead?: boolean
  leadId?: string
}

export interface TrialContactPerson {
  id: string
  name: string
  phone: string
  source?: string
  isFromLead?: boolean
  leadId?: string
  address?: string
  children: TrialContactChild[]
}

export interface CreateTrialClassFormState {
  contactId: string
  childId: string
  customParentName: string
  customPhone: string
  customChildName: string
  school: string
  program: string
  subject: string
  notes: string
  leadId?: string
}
