import type { User } from '../../types/user'
import { RoleBadge, UserStatusBadge } from '../common/Badge'
import { formatDate } from '../../utils/dateUtils'
import EmptyState from '../common/EmptyState'

interface UserTableProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  onToggleStatus: (user: User) => void
}

export default function UserTable({ users, onEdit, onDelete, onToggleStatus }: UserTableProps) {
  if (users.length === 0) {
    return <EmptyState title="No users found" description="Try a different search or add a new user." />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-card">
      <table className="min-w-full divide-y divide-ink-100 dark:divide-ink-700 text-sm">
        <thead className="bg-ink-50/60 dark:bg-ink-900/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Joined</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-ink-50/40 dark:hover:bg-ink-900/40">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-700 dark:text-ink-200">{u.fullName}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{u.email}</td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{u.department}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <RoleBadge role={u.role} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <UserStatusBadge status={u.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-400 dark:text-ink-400">{formatDate(u.createdDate)}</td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onToggleStatus(u)} className="text-xs font-medium text-steel-600 dark:text-steel-400 hover:underline">
                    {u.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => onEdit(u)} className="text-xs font-medium text-ink-500 dark:text-ink-400 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => onDelete(u)} className="text-xs font-medium text-brick-500 dark:text-brick-400 hover:underline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
