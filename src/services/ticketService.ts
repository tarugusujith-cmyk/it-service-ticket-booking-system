import { api } from './api'
import type { Ticket, ActivityEntry } from '../types/ticket'

export async function getTickets(): Promise<Ticket[]> {
  const { data } = await api.get<Ticket[]>('/tickets')
  return data.sort(
    (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  )
}

export async function getTicketById(id: string): Promise<Ticket> {
  const { data } = await api.get<Ticket>(`/tickets/${id}`)
  return data
}

export async function createTicket(ticket: Ticket): Promise<Ticket> {
  const { data } = await api.post<Ticket>('/tickets', ticket)
  return data
}

export async function updateTicket(id: string, patch: Partial<Ticket>): Promise<Ticket> {
  const { data } = await api.patch<Ticket>(`/tickets/${id}`, patch)
  return data
}

export async function deleteTicket(id: string): Promise<void> {
  await api.delete(`/tickets/${id}`)
}

export function appendActivity(ticket: Ticket, message: string): ActivityEntry[] {
  const entry: ActivityEntry = {
    id: `a${Date.now()}`,
    timestamp: new Date().toISOString(),
    message,
  }
  return [...ticket.activity, entry]
}

export function nextTicketNumber(existing: Ticket[]): string {
  const nums = existing
    .map((t) => parseInt(t.ticketNumber.replace('TCK-', ''), 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length ? Math.max(...nums) : 1000
  return `TCK-${max + 1}`
}
