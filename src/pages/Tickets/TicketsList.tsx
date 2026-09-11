import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Ticket, Priority, TicketStatus } from '../../types/ticket'
import type { Category } from '../../types/category'
import { getTickets } from '../../services/ticketService'
import { getCategories } from '../../services/categoryService'
import { useAuth } from '../../hooks/useAuth'
import TicketTable from '../../components/Tickets/TicketTable'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

const statuses: TicketStatus[] = ['Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Cancelled']
const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical']
const priorityRank: Record<Priority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 }
const PAGE_SIZE = 8

type SortKey = 'newest' | 'oldest' | 'priority' | 'updated'

export default function TicketsList() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<SortKey>('newest')
  const [page, setPage] = useState(1)

  function load() {
    setError('')
    setTickets(null)
    Promise.all([getTickets(), getCategories()])
      .then(([t, c]) => {
        setTickets(t)
        setCategories(c)
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load tickets.'))
  }

  useEffect(load, [])

  const scoped = useMemo(() => {
    if (!tickets || !user) return []
    if (user.role === 'admin') return tickets
    if (user.role === 'agent') return tickets.filter((t) => t.assignedAgent === user.id)
    return tickets.filter((t) => t.createdBy === user.id)
  }, [tickets, user])

  const filtered = useMemo(() => {
    let list = scoped
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (t) =>
          t.ticketNumber.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.createdByName.toLowerCase().includes(q) ||
          t.assignedAgentName.toLowerCase().includes(q)
      )
    }
    if (status) list = list.filter((t) => t.status === status)
    if (priority) list = list.filter((t) => t.priority === priority)
    if (category) list = list.filter((t) => t.category === category)

    const sorted = [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      if (sort === 'oldest') return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      if (sort === 'priority') return priorityRank[b.priority] - priorityRank[a.priority]
      return new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime()
    })
    return sorted
  }, [scoped, search, status, priority, category, sort])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function resetFilters() {
    setSearch('')
    setStatus('')
    setPriority('')
    setCategory('')
    setSort('newest')
    setPage(1)
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!tickets) return <Loader label="Loading tickets…" />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-800 dark:text-ink-100">
            {user?.role === 'employee' ? 'My tickets' : user?.role === 'agent' ? 'My assigned tickets' : 'All tickets'}
          </h2>
          <p className="text-sm text-ink-400 dark:text-ink-400">{filtered.length} ticket{filtered.length !== 1 && 's'} found</p>
        </div>
        {user?.role === 'employee' && (
          <Link to="/tickets/new" className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600">
            Create ticket
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-3 shadow-card">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1) }}
          placeholder="Search by ticket ID, subject, requester or agent…"
          className="min-w-[220px] flex-1 rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={priority} onChange={(e) => { setPriority(e.target.value); setPage(1) }} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm">
          <option value="">All priorities</option>
          {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1) }} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm">
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">Highest priority</option>
          <option value="updated">Recently updated</option>
        </select>
        {(search || status || priority || category || sort !== 'newest') && (
          <button onClick={resetFilters} className="rounded-md px-3 py-2 text-sm font-medium text-ink-400 dark:text-ink-400 hover:text-ink-600 dark:hover:text-ink-300">
            Clear
          </button>
        )}
      </div>

      <TicketTable
        tickets={pageItems}
        showRequester={user?.role !== 'employee'}
        showAgent={user?.role !== 'agent'}
      />

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-1.5 text-sm text-ink-500 dark:text-ink-400 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-sm text-ink-400 dark:text-ink-400">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-1.5 text-sm text-ink-500 dark:text-ink-400 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
