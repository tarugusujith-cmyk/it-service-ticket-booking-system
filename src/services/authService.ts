import { api } from './api'
import type { User, SafeUser } from '../types/user'

const STORAGE_KEY = 'deskflow_session'

function toSafeUser(user: User): SafeUser {
  const { password, ...safe } = user
  return safe
}

export async function login(email: string, password: string): Promise<SafeUser> {
  const { data } = await api.get<User[]>('/users', {
    params: { email },
  })

  const user = data.find((u) => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    throw new Error('No account found with that email address.')
  }
  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again.')
  }
  if (user.status === 'inactive') {
    throw new Error('This account has been deactivated. Contact an administrator.')
  }

  const safe = toSafeUser(user)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe))
  return safe
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
}

export function getSession(): SafeUser | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as SafeUser
  } catch {
    return null
  }
}

export function saveSession(user: SafeUser) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}
