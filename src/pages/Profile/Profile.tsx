import { useAuth } from '../../hooks/useAuth'
import { RoleBadge, UserStatusBadge } from '../../components/common/Badge'
import { formatDate } from '../../utils/dateUtils'

export default function Profile() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <div className="max-w-lg">
      <h2 className="mb-5 text-lg font-semibold text-ink-800 dark:text-ink-100">Profile</h2>
      <div className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-steel-100 dark:bg-steel-800 text-xl font-semibold text-steel-700 dark:text-steel-300">
            {user.fullName.charAt(0)}
          </div>
          <div>
            <p className="text-base font-semibold text-ink-800 dark:text-ink-100">{user.fullName}</p>
            <div className="mt-1 flex gap-2">
              <RoleBadge role={user.role} />
              <UserStatusBadge status={user.status} />
            </div>
          </div>
        </div>

        <dl className="mt-6 space-y-3 border-t border-ink-100 dark:border-ink-700 pt-5 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-400 dark:text-ink-400">Email</dt>
            <dd className="text-ink-700 dark:text-ink-200">{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-400 dark:text-ink-400">Phone</dt>
            <dd className="text-ink-700 dark:text-ink-200">{user.phone}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-400 dark:text-ink-400">Department</dt>
            <dd className="text-ink-700 dark:text-ink-200">{user.department}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-400 dark:text-ink-400">Member since</dt>
            <dd className="text-ink-700 dark:text-ink-200">{formatDate(user.createdDate)}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}
