import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

const demoAccounts = [
  { role: 'Admin', email: 'admin@deskflow.io', password: 'Admin@123' },
  { role: 'Support Agent', email: 'agent1@deskflow.io', password: 'Agent@123' },
  { role: 'Employee', email: 'employee@deskflow.io', password: 'Employee@123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) {
      setError('Enter both your email and password.')
      return
    }
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  function fillDemo(demoEmail: string, demoPassword: string) {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  return (
    <div className="flex min-h-screen bg-ink-900">
      <div className="hidden flex-1 flex-col justify-between bg-ink-900 p-12 text-ink-100 md:flex">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-steel-500 font-mono text-sm font-semibold text-white">DF</div>
          <span className="text-lg font-semibold">DeskFlow</span>
        </div>
        <div className="max-w-md">
          <h2 className="text-3xl font-semibold leading-snug text-white">
            One queue for every request, from a flickering monitor to a firewall change.
          </h2>
          <p className="mt-4 text-sm text-ink-400">
            Track, assign, and resolve IT tickets with role-based visibility for admins, support agents, and employees.
          </p>
        </div>
        <p className="text-xs text-ink-500">© 2026 DeskFlow Service Desk</p>
      </div>

      <div className="flex flex-1 items-center justify-center bg-ink-50 dark:bg-ink-900 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-steel-500 font-mono text-sm font-semibold text-white">DF</div>
              <span className="text-lg font-semibold text-ink-800 dark:text-ink-100">DeskFlow</span>
            </div>
          </div>

          <h1 className="text-xl font-semibold text-ink-800 dark:text-ink-100">Sign in to your desk</h1>
          <p className="mt-1 text-sm text-ink-400 dark:text-ink-400">Enter your credentials to continue.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@deskflow.io"
                className="w-full rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Password</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="••••••••"
                className="w-full rounded-md border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
              />
            </div>

            {error && <p className="text-sm text-brick-500 dark:text-brick-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-md bg-steel-500 py-2.5 text-sm font-semibold text-white hover:bg-steel-600 disabled:opacity-60"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-8 rounded-lg border border-ink-200 dark:border-ink-700 bg-white dark:bg-ink-800 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-400">Demo accounts</p>
            <div className="space-y-1.5">
              {demoAccounts.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc.email, acc.password)}
                  className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-xs hover:bg-ink-50 dark:hover:bg-ink-900"
                >
                  <span className="font-medium text-ink-600 dark:text-ink-300">{acc.role}</span>
                  <span className="font-mono text-ink-400 dark:text-ink-400">{acc.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
