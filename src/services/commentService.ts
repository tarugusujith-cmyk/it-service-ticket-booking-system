import { api } from './api'
import type { Comment } from '../types/comment'

export async function getCommentsByTicket(ticketId: string): Promise<Comment[]> {
  const { data } = await api.get<Comment[]>('/comments', { params: { ticketId } })
  return data.sort((a, b) => a.id.localeCompare(b.id))
}

export async function addComment(comment: Omit<Comment, 'id'>): Promise<Comment> {
  const { data } = await api.post<Comment>('/comments', comment)
  return data
}
