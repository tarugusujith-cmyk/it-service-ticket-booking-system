import { api } from './api'
import type { Category } from '../types/category'

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>('/categories')
  return data
}

export async function createCategory(category: Omit<Category, 'id'>): Promise<Category> {
  const { data } = await api.post<Category>('/categories', category)
  return data
}

export async function updateCategory(id: string, patch: Partial<Category>): Promise<Category> {
  const { data } = await api.patch<Category>(`/categories/${id}`, patch)
  return data
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/categories/${id}`)
}
