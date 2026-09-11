import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface NavItem {
  to: string
  label: string
  icon: string
}

const navByRole: Record<string, NavItem[]> = {
  admin: [
    { to: '/dashboard', label: 'Dashboard', icon: '◧' },
    { to: '/tickets', label: 'Tickets', icon: '☰' },
    { to: '/users', label: 'Users', icon: '◍' },
    { to: '/categories', label: 'Categories', icon: '▤' },
  ],
  agent: [
    { to: '/dashboard', label: 'Dashboard', icon: '◧' },
    { to: '/tickets', label: 'My Tickets', icon: '☰' },
  ],
  employee: [
    { to: '/dashboard', label: 'Dashboard', icon: '◧' },
    { to: '/tickets/new', label: 'Create Ticket', icon: '✎' },
    { to: '/tickets', label: 'My Tickets', icon: '☰' },
  ],
}

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { user } = useAuth()
  if (!user) return null
  const items = navByRole[user.role] ?? []

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-ink-900/40 md:hidden" onClick={onClose} />}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col bg-ink-900 text-ink-100 transition-transform md:static md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-steel-500 font-mono text-sm font-semibold text-white">
            DF
          </div>
          <div>
            <p className="text-sm font-semibold text-white">DeskFlow</p>
            <p className="text-[11px] text-ink-400">Service Desk</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-steel-600 text-white'
                    : 'text-ink-300 hover:bg-ink-800 hover:text-white'
                }`
              }
            >
              <span className="w-4 text-center text-[15px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-800 px-5 py-4">
          <p className="text-[11px] text-ink-500">Signed in as</p>
          <p className="truncate text-sm font-medium text-ink-100">{user.fullName}</p>
        </div>
      </aside>
    </>
  )
}
