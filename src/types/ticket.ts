export type Priority = 'Low' | 'Medium' | 'High' | 'Critical'

export type TicketStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Pending'
  | 'Resolved'
  | 'Closed'
  | 'Cancelled'

export type ContactMethod = 'Email' | 'Phone' | 'Chat'

export interface ActivityEntry {
  id: string
  timestamp: string
  message: string
}

export interface Ticket {
  id: string
  ticketNumber: string
  subject: string
  description: string
  createdBy: string
  createdByName: string
  assignedAgent: string
  assignedAgentName: string
  category: string
  priority: Priority
  status: TicketStatus
  preferredContact: ContactMethod
  createdDate: string
  updatedDate: string
  dueDate: string
  resolution: string
  resolutionDate: string
  activity: ActivityEntry[]
}

export interface TicketFormInput {
  subject: string
  description: string
  category: string
  priority: Priority
  preferredContact: ContactMethod
}
