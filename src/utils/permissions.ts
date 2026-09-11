import type { Role } from '../types/user'
import type { Ticket, TicketStatus } from '../types/ticket'

export function canViewAllTickets(role: Role): boolean {
  return role === 'admin'
}

export function canViewTicket(role: Role, userId: string, ticket: Ticket): boolean {
  if (role === 'admin') return true
  if (role === 'agent') return ticket.assignedAgent === userId
  return ticket.createdBy === userId
}

export function canEditTicket(role: Role, userId: string, ticket: Ticket): boolean {
  if (role === 'admin') return true
  if (role === 'agent') return ticket.assignedAgent === userId
  return ticket.createdBy === userId && ticket.status === 'Open'
}

export function canDeleteTicket(role: Role): boolean {
  return role === 'admin'
}

export function canAssignTicket(role: Role): boolean {
  return role === 'admin'
}

export function canAddResolution(role: Role, userId: string, ticket: Ticket): boolean {
  if (role === 'admin') return true
  if (role === 'agent') return ticket.assignedAgent === userId
  return false
}

export function canComment(role: Role, userId: string, ticket: Ticket): boolean {
  return canViewTicket(role, userId, ticket)
}

export function canManageUsers(role: Role): boolean {
  return role === 'admin'
}

export function canManageCategories(role: Role): boolean {
  return role === 'admin'
}

/** Returns the set of statuses a user is allowed to move a ticket into, from its current status. */
export function nextAllowedStatuses(
  role: Role,
  userId: string,
  ticket: Ticket
): TicketStatus[] {
  const { status } = ticket
  const isOwner = ticket.createdBy === userId
  const isAssignedAgent = ticket.assignedAgent === userId

  if (role === 'admin') {
    const flow: Record<TicketStatus, TicketStatus[]> = {
      Open: ['Assigned', 'Cancelled'],
      Assigned: ['In Progress', 'Cancelled'],
      'In Progress': ['Pending', 'Resolved'],
      Pending: ['In Progress', 'Resolved'],
      Resolved: ['Closed', 'In Progress'],
      Closed: [],
      Cancelled: [],
    }
    return flow[status] ?? []
  }

  if (role === 'agent' && isAssignedAgent) {
    const flow: Partial<Record<TicketStatus, TicketStatus[]>> = {
      Assigned: ['In Progress'],
      'In Progress': ['Pending', 'Resolved'],
      Pending: ['In Progress'],
      Resolved: ['Closed'],
    }
    return flow[status] ?? []
  }

  if (role === 'employee' && isOwner) {
    if (status === 'Open') return ['Cancelled']
    if (status === 'Resolved') return ['In Progress']
    return []
  }

  return []
}
