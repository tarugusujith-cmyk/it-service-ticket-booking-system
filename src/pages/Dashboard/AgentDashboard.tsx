import { useEffect, useState } from 'react'
import type { Ticket } from '../../types/ticket'
import { getTickets } from '../../services/ticketService'
import { useAuth } from '../../hooks/useAuth'
import StatCard from '../../components/Dashboard/StatCard'
import TicketTable from '../../components/Tickets/TicketTable'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function AgentDashboard() {
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

  const mine = tickets.filter((t) => t.assignedAgent === user.id)
  const count = (pred: (t: Ticket) => boolean) => mine.filter(pred).length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-ink-800 dark:text-ink-100">Your workspace</h2>
        <p className="text-sm text-ink-400 dark:text-ink-400">Tickets currently assigned to you.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="My assigned" value={mine.length} tone="steel" />
        <StatCard label="New" value={count((t) => t.status === 'Assigned')} tone="amber" />
        <StatCard label="In progress" value={count((t) => t.status === 'In Progress')} tone="amber" />
        <StatCard label="Pending" value={count((t) => t.status === 'Pending')} tone="brick" />
        <StatCard label="Resolved" value={count((t) => t.status === 'Resolved')} tone="moss" />
      </div>
      <StatCard label="High priority" value={count((t) => t.priority === 'High' || t.priority === 'Critical')} tone="brick" />

      <div>
        <h3 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-200">My tickets</h3>
        <TicketTable tickets={mine} showAgent={false} />
      </div>
    </div>
  )
}
