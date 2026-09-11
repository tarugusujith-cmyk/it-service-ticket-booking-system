import { useNavigate } from 'react-router-dom'
import type { Ticket } from '../../types/ticket'
import { StatusBadge, PriorityBadge } from '../common/Badge'
import { formatDate } from '../../utils/dateUtils'
import EmptyState from '../common/EmptyState'

interface TicketTableProps {
  tickets: Ticket[]
  showRequester?: boolean
  showAgent?: boolean
}

export default function TicketTable({ tickets, showRequester = true, showAgent = true }: TicketTableProps) {
  const navigate = useNavigate()

  if (tickets.length === 0) {
    return <EmptyState title="No tickets here" description="Nothing matches right now — new tickets will show up in this list." />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-card">
      <table className="min-w-full divide-y divide-ink-100 dark:divide-ink-700 text-sm">
        <thead className="bg-ink-50/60 dark:bg-ink-900/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-400">
          <tr>
            <th className="px-4 py-3">Ticket</th>
            <th className="px-4 py-3">Subject</th>
            {showRequester && <th className="px-4 py-3">Requester</th>}
            {showAgent && <th className="px-4 py-3">Agent</th>}
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
          {tickets.map((t) => (
            <tr
              key={t.id}
              onClick={() => navigate(`/tickets/${t.id}`)}
              className="cursor-pointer hover:bg-steel-50/60 dark:hover:bg-steel-900/60"
            >
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-ink-500 dark:text-ink-400">{t.ticketNumber}</td>
              <td className="max-w-xs truncate px-4 py-3 font-medium text-ink-700 dark:text-ink-200">{t.subject}</td>
              {showRequester && <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{t.createdByName}</td>}
              {showAgent && (
                <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">
                  {t.assignedAgentName || <span className="text-ink-300 dark:text-ink-600">Unassigned</span>}
                </td>
              )}
              <td className="whitespace-nowrap px-4 py-3 text-ink-500 dark:text-ink-400">{t.category}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <PriorityBadge priority={t.priority} />
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-ink-400 dark:text-ink-400">{formatDate(t.updatedDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
