import { createContext, useEffect, useState, type ReactNode } from 'react'
import type { SafeUser } from '../types/user'
import { getSession, login as loginRequest, logout as logoutRequest } from '../services/authService'

interface AuthContextValue {
  user: SafeUser | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: SafeUser) => void
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setUser(getSession())
    setIsLoading(false)
  }, [])

  async function login(email: string, password: string) {
    const safeUser = await loginRequest(email, password)
    setUser(safeUser)
  }

  function logout() {
    logoutRequest()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
