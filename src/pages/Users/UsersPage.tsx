import { useEffect, useMemo, useState } from 'react'
import type { User } from '../../types/user'
import { createUser, deleteUser, getUsers, updateUser } from '../../services/userService'
import { useToast } from '../../hooks/useToast'
import UserTable from '../../components/Users/UserTable'
import UserForm from '../../components/Users/UserForm'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function UsersPage() {
  const { showToast } = useToast()
  const [users, setUsers] = useState<User[] | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

  function load() {
    setError('')
    setUsers(null)
    getUsers()
      .then(setUsers)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load users.'))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    if (!users) return []
    const q = search.trim().toLowerCase()
    return users.filter((u) => {
      const matchesQuery = !q || u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      const matchesRole = !roleFilter || u.role === roleFilter
      return matchesQuery && matchesRole
    })
  }, [users, search, roleFilter])

  function openCreate() {
    setEditingUser(undefined)
    setFormOpen(true)
  }

  function openEdit(user: User) {
    setEditingUser(user)
    setFormOpen(true)
  }

  async function handleSubmit(input: Omit<User, 'id' | 'createdDate'>) {
    try {
      if (editingUser) {
        const updated = await updateUser(editingUser.id, input)
        setUsers((prev) => prev && prev.map((u) => (u.id === updated.id ? updated : u)))
        showToast('User updated.')
      } else {
        const created = await createUser({ ...input, createdDate: new Date().toISOString().slice(0, 10) })
        setUsers((prev) => (prev ? [created, ...prev] : [created]))
        showToast('User added.')
      }
      setFormOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save user.', 'error')
    }
  }

  async function handleToggleStatus(user: User) {
    const nextStatus = user.status === 'active' ? 'inactive' : 'active'
    try {
      const updated = await updateUser(user.id, { status: nextStatus })
      setUsers((prev) => prev && prev.map((u) => (u.id === updated.id ? updated : u)))
      showToast(`${user.fullName} ${nextStatus === 'active' ? 'activated' : 'deactivated'}.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update status.', 'error')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteUser(deleteTarget.id)
      setUsers((prev) => prev && prev.filter((u) => u.id !== deleteTarget.id))
      showToast('User deleted.')
      setDeleteTarget(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete user.', 'error')
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!users) return <Loader label="Loading users…" />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-800 dark:text-ink-100">User management</h2>
          <p className="text-sm text-ink-400 dark:text-ink-400">{filtered.length} user{filtered.length !== 1 && 's'}</p>
        </div>
        <button onClick={openCreate} className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600">
          Add user
        </button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-3 shadow-card">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="min-w-[220px] flex-1 rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
        />
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm">
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="agent">Support Agent</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <UserTable users={filtered} onEdit={openEdit} onDelete={setDeleteTarget} onToggleStatus={handleToggleStatus} />

      <Modal title={editingUser ? 'Edit user' : 'Add user'} isOpen={formOpen} onClose={() => setFormOpen(false)} size="lg">
        <UserForm initial={editingUser} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>

      <Modal
        title="Delete user"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900">
              Cancel
            </button>
            <button onClick={handleDelete} className="rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-white hover:bg-brick-600">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-300">
          Remove <span className="font-medium">{deleteTarget?.fullName}</span> from the system? This cannot be undone.
        </p>
      </Modal>
    </div>
  )
}
