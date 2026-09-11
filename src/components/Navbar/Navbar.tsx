import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { RoleBadge } from '../common/Badge'
import ThemeToggle from '../common/ThemeToggle'

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between gap-2 border-b border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 px-3 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-3">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-md p-2 text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 md:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>
        <h1 className="truncate text-sm font-semibold text-ink-700 dark:text-ink-200 md:text-base">
          {user?.role === 'admin' && 'Admin Overview'}
          {user?.role === 'agent' && 'Support Workspace'}
          {user?.role === 'employee' && 'My Support Space'}
        </h1>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-3">
        <ThemeToggle />
        {user && (
          <span className="hidden sm:inline-flex">
            <RoleBadge role={user.role} />
          </span>
        )}
        <button
          onClick={() => navigate('/profile')}
          className="flex items-center gap-2 rounded-md px-1.5 py-1.5 hover:bg-ink-50 dark:hover:bg-ink-900 md:px-2"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-steel-100 dark:bg-steel-800 text-sm font-semibold text-steel-700 dark:text-steel-300">
            {user?.fullName.charAt(0)}
          </div>
          <span className="hidden text-sm font-medium text-ink-600 dark:text-ink-300 sm:inline">{user?.fullName}</span>
        </button>
        <button
          onClick={handleLogout}
          aria-label="Logout"
          title="Logout"
          className="rounded-md border border-ink-200 dark:border-ink-700 px-2.5 py-1.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900 md:px-3"
        >
          <span className="sm:hidden" aria-hidden="true">⏻</span>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
