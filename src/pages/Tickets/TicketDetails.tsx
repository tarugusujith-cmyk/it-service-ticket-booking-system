import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Ticket, TicketStatus } from '../../types/ticket'
import {
  appendActivity,
  deleteTicket,
  getTicketById,
  updateTicket,
} from '../../services/ticketService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import {
  canAddResolution,
  canAssignTicket,
  canComment,
  canDeleteTicket,
  canEditTicket,
  nextAllowedStatuses,
} from '../../utils/permissions'
import { StatusBadge, PriorityBadge } from '../../components/common/Badge'
import { formatDate, formatDateTime } from '../../utils/dateUtils'
import Modal from '../../components/common/Modal'
import AssignmentModal from '../../components/Tickets/AssignmentModal'
import ResolutionForm from '../../components/Tickets/ResolutionForm'
import CommentSection from '../../components/Tickets/CommentSection'
import ActivityTimeline from '../../components/Tickets/ActivityTimeline'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function TicketDetails() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [error, setError] = useState('')
  const [assignOpen, setAssignOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [resolutionOpen, setResolutionOpen] = useState(false)
  const [busyStatus, setBusyStatus] = useState<TicketStatus | null>(null)

  function load() {
    if (!id) return

    setError('')
    setTicket(null)

    getTicketById(id)
      .then(setTicket)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : 'Could not load ticket.'
        )
      )
  }

  useEffect(load, [id])

  if (error) {
    return <ErrorState message={error} onRetry={load} />
  }

  if (!ticket || !user) {
    return <Loader label="Loading ticket…" />
  }

  const editAllowed = canEditTicket(user.role, user.id, ticket)
  const deleteAllowed = canDeleteTicket(user.role)
  const assignAllowed = canAssignTicket(user.role)
  const resolutionAllowed = canAddResolution(user.role, user.id, ticket)
  const commentAllowed = canComment(user.role, user.id, ticket)
  const statusOptions = nextAllowedStatuses(user.role, user.id, ticket)

  async function handleStatusChange(next: TicketStatus) {
    if (!ticket) return

    if (next === 'Resolved' && !resolutionAllowed) {
      return
    }

    if (next === 'Resolved') {
      setResolutionOpen(true)
      return
    }

    setBusyStatus(next)

    try {
      const updated = await updateTicket(ticket.id, {
        status: next,
        updatedDate: new Date().toISOString(),
        activity: appendActivity(ticket, `Status changed to ${next}`),
      })

      setTicket(updated)
      showToast(`Ticket moved to ${next}.`)
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Could not update status.',
        'error'
      )
    } finally {
      setBusyStatus(null)
    }
  }

  async function handleResolve(resolutionText: string) {
    if (!ticket) return

    const now = new Date().toISOString()

    try {
      const updated = await updateTicket(ticket.id, {
        status: 'Resolved',
        resolution: resolutionText,
        resolutionDate: now,
        updatedDate: now,

        // FIXED:
        // appendActivity expects a Ticket, not ActivityEntry[]
        activity: appendActivity(ticket, 'Ticket resolved'),
      })

      setTicket(updated)
      setResolutionOpen(false)
      showToast('Ticket marked resolved.')
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Could not resolve ticket.',
        'error'
      )
    }
  }

  async function handleAssign(agent: {
    id: string
    fullName: string
  }) {
    if (!ticket) return

    const wasUnassigned = !ticket.assignedAgent

    try {
      const updated = await updateTicket(ticket.id, {
        assignedAgent: agent.id,
        assignedAgentName: agent.fullName,
        status:
          ticket.status === 'Open'
            ? 'Assigned'
            : ticket.status,
        updatedDate: new Date().toISOString(),
        activity: appendActivity(
          ticket,
          wasUnassigned
            ? `Ticket assigned to ${agent.fullName}`
            : `Ticket reassigned to ${agent.fullName}`
        ),
      })

      setTicket(updated)
      showToast('Ticket assignment updated.')
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Could not assign ticket.',
        'error'
      )
    }
  }

  async function handleDelete() {
    if (!ticket) return

    try {
      await deleteTicket(ticket.id)
      showToast('Ticket deleted.')
      navigate('/tickets')
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'Could not delete ticket.',
        'error'
      )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs text-ink-400 dark:text-ink-400">
            {ticket.ticketNumber}
          </p>

          <h2 className="mt-1 text-xl font-semibold text-ink-800 dark:text-ink-100">
            {ticket.subject}
          </h2>

          <div className="mt-2 flex items-center gap-2">
            <StatusBadge status={ticket.status} />
            <PriorityBadge priority={ticket.priority} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {editAllowed && (
            <Link
              to={`/tickets/${ticket.id}/edit`}
              className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-1.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900"
            >
              Edit
            </Link>
          )}

          {assignAllowed && (
            <button
              onClick={() => setAssignOpen(true)}
              className="rounded-md border border-ink-200 dark:border-ink-700 px-3 py-1.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900"
            >
              {ticket.assignedAgent ? 'Reassign' : 'Assign'}
            </button>
          )}

          {deleteAllowed && (
            <button
              onClick={() => setDeleteOpen(true)}
              className="rounded-md border border-brick-200 dark:border-brick-800 px-3 py-1.5 text-sm font-medium text-brick-500 dark:text-brick-400 hover:bg-brick-50 dark:hover:bg-brick-900"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {statusOptions.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-3 shadow-card">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400 dark:text-ink-400">
            Move to:
          </span>

          {statusOptions.map((s) => (
            <button
              key={s}
              disabled={busyStatus === s}
              onClick={() => handleStatusChange(s)}
              className="rounded-md bg-ink-800 dark:bg-ink-200 px-3 py-1.5 text-xs font-medium text-white hover:bg-ink-700 dark:hover:bg-ink-300 disabled:opacity-50"
            >
              {busyStatus === s ? 'Updating…' : s}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-5 shadow-card">
            <h3 className="mb-2 text-sm font-semibold text-ink-700 dark:text-ink-200">
              Description
            </h3>

            <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-600 dark:text-ink-300">
              {ticket.description}
            </p>
          </section>

          {ticket.resolution && (
            <section className="rounded-lg border border-moss-400/30 dark:border-moss-500/30 bg-moss-50 dark:bg-moss-900 p-5">
              <h3 className="mb-2 text-sm font-semibold text-moss-600 dark:text-moss-400">
                Resolution
              </h3>

              <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-600 dark:text-ink-300">
                {ticket.resolution}
              </p>

              <p className="mt-2 text-xs text-ink-400 dark:text-ink-400">
                Resolved {formatDateTime(ticket.resolutionDate)}
              </p>
            </section>
          )}

          <section className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-200">
              Comments
            </h3>

            <CommentSection
              ticketId={ticket.id}
              canComment={commentAllowed}
            />
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-200">
              Details
            </h3>

            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-400 dark:text-ink-400">
                  Created by
                </dt>

                <dd className="text-right text-ink-700 dark:text-ink-200">
                  {ticket.createdByName}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-ink-400 dark:text-ink-400">
                  Assigned agent
                </dt>

                <dd className="text-right text-ink-700 dark:text-ink-200">
                  {ticket.assignedAgentName || 'Unassigned'}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-ink-400 dark:text-ink-400">
                  Category
                </dt>

                <dd className="text-right text-ink-700 dark:text-ink-200">
                  {ticket.category}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-ink-400 dark:text-ink-400">
                  Preferred contact
                </dt>

                <dd className="text-right text-ink-700 dark:text-ink-200">
                  {ticket.preferredContact}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-ink-400 dark:text-ink-400">
                  Created
                </dt>

                <dd className="text-right text-ink-700 dark:text-ink-200">
                  {formatDate(ticket.createdDate)}
                </dd>
              </div>

              <div className="flex justify-between gap-4">
                <dt className="text-ink-400 dark:text-ink-400">
                  Updated
                </dt>

                <dd className="text-right text-ink-700 dark:text-ink-200">
                  {formatDate(ticket.updatedDate)}
                </dd>
              </div>

              {ticket.dueDate && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-400 dark:text-ink-400">
                    Due
                  </dt>

                  <dd className="text-right text-ink-700 dark:text-ink-200">
                    {formatDate(ticket.dueDate)}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-5 shadow-card">
            <h3 className="mb-3 text-sm font-semibold text-ink-700 dark:text-ink-200">
              Activity
            </h3>

            <ActivityTimeline activity={ticket.activity} />
          </section>
        </div>
      </div>

      {assignAllowed && (
        <AssignmentModal
          isOpen={assignOpen}
          onClose={() => setAssignOpen(false)}
          currentAgentId={ticket.assignedAgent}
          onAssign={handleAssign}
        />
      )}

      <Modal
        title="Add resolution"
        isOpen={resolutionOpen}
        onClose={() => setResolutionOpen(false)}
      >
        <ResolutionForm
          onSubmit={handleResolve}
          onCancel={() => setResolutionOpen(false)}
        />
      </Modal>

      <Modal
        title="Delete ticket"
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <button
              onClick={() => setDeleteOpen(false)}
              className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-white hover:bg-brick-600"
            >
              Delete permanently
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-300">
          This will permanently delete{' '}
          <span className="font-medium">{ticket.ticketNumber}</span>{' '}
          and its history. This action cannot be undone.
        </p>
      </Modal>
    </div>
  )
}