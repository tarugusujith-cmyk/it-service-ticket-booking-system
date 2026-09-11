import { useEffect, useState } from 'react'
import type { Ticket } from '../../types/ticket'
import { getTickets } from '../../services/ticketService'
import StatCard from '../../components/Dashboard/StatCard'
import TicketTable from '../../components/Tickets/TicketTable'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function AdminDashboard() {
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
  if (!tickets) return <Loader label="Loading dashboard…" />

  const count = (pred: (t: Ticket) => boolean) => tickets.filter(pred).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-800 dark:text-ink-100">Admin overview</h2>
        <p className="text-sm text-ink-400 dark:text-ink-400">A full picture of every ticket moving through the desk.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total tickets" value={tickets.length} tone="steel" />
        <StatCard label="Open" value={count((t) => t.status === 'Open')} />
        <StatCard label="Assigned" value={count((t) => t.status === 'Assigned')} tone="amber" />
        <StatCard label="In progress" value={count((t) => t.status === 'In Progress')} tone="amber" />
        <StatCard label="Pending" value={count((t) => t.status === 'Pending')} tone="brick" />
        <StatCard label="Resolved" value={count((t) => t.status === 'Resolved')} tone="moss" />
        <StatCard label="Closed" value={count((t) => t.status === 'Closed')} />
        <StatCard label="Critical" value={count((t) => t.priority === 'Critical')} tone="brick" />
        <StatCard label="Unassigned" value={count((t) => !t.assignedAgent)} tone="amber" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-200">Recent tickets</h3>
        <TicketTable tickets={tickets.slice(0, 8)} />
      </div>
    </div>
  )
}
