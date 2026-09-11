import { api } from './api'
import type { User } from '../types/user'

export async function getUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>('/users')
  return data
}

export async function getUserById(id: string): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`)
  return data
}

export async function createUser(user: Omit<User, 'id'>): Promise<User> {
  const { data } = await api.post<User>('/users', user)
  return data
}

export async function updateUser(id: string, patch: Partial<User>): Promise<User> {
  const { data } = await api.patch<User>(`/users/${id}`, patch)
  return data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}
