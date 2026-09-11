import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Ticket } from '../../types/ticket'
import { getTickets } from '../../services/ticketService'
import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/Dashboard/StatCard'
import TicketTable from '../../components/Tickets/TicketTable'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function EmployeeDashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[] | null>(null)
  const [error, setError] = useState('')

  function load() {
    setError('')
    setTickets(null)
    getTickets()
      .then(setTickets)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load tickets.'))
  }

  useEffect(load, [])

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!tickets || !user) return <Loader label="Loading dashboard…" />

  const mine = tickets.filter((t) => t.createdBy === user.id)
  const count = (pred: (t: Ticket) => boolean) => mine.filter(pred).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink-800 dark:text-ink-100">My support space</h2>
          <p className="text-sm text-ink-400 dark:text-ink-400">Track requests you've raised with IT.</p>
        </div>
        <Link
          to="/tickets/new"
          className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600"
        >
          Create ticket
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total" value={mine.length} tone="steel" />
        <StatCard label="Open" value={count((t) => t.status === 'Open')} />
        <StatCard label="In progress" value={count((t) => t.status === 'In Progress')} tone="amber" />
        <StatCard label="Resolved" value={count((t) => t.status === 'Resolved')} tone="moss" />
        <StatCard label="Closed" value={count((t) => t.status === 'Closed')} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-200">My tickets</h3>
        <TicketTable tickets={mine} showRequester={false} />
      </div>
    </div>
  )
}
