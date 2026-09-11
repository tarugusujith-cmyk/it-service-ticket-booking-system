import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Category } from '../../types/category'
import type { Ticket, TicketFormInput } from '../../types/ticket'
import { getCategories } from '../../services/categoryService'
import { getTicketById, updateTicket, appendActivity } from '../../services/ticketService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { canEditTicket } from '../../utils/permissions'
import TicketForm from '../../components/Tickets/TicketForm'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function EditTicket() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [error, setError] = useState('')

  function load() {
    if (!id) return
    setError('')
    setTicket(null)
    Promise.all([getTicketById(id), getCategories()])
      .then(([t, c]) => {
        setTicket(t)
        setCategories(c.filter((cat) => cat.status === 'active'))
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load ticket.'))
  }

  useEffect(load, [id])

  async function handleSubmit(input: TicketFormInput) {
    if (!ticket) return
    try {
      const updated = await updateTicket(ticket.id, {
        subject: input.subject,
        description: input.description,
        category: input.category,
        priority: input.priority,
        preferredContact: input.preferredContact,
        updatedDate: new Date().toISOString(),
        activity: appendActivity(ticket, 'Ticket details updated'),
      })
      showToast('Ticket updated.')
      navigate(`/tickets/${updated.id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update ticket.', 'error')
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!ticket || !user) return <Loader label="Loading ticket…" />

  if (!canEditTicket(user.role, user.id, ticket)) {
    return <ErrorState message="You don't have permission to edit this ticket." />
  }

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 text-lg font-semibold text-ink-800 dark:text-ink-100">Edit ticket {ticket.ticketNumber}</h2>
      <p className="mb-5 text-sm text-ink-400 dark:text-ink-400">Update the details below.</p>
      <div className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-5 shadow-card">
        <TicketForm
          categories={categories}
          initial={ticket}
          onSubmit={handleSubmit}
          onCancel={() => navigate(-1)}
          submitLabel="Save changes"
        />
      </div>
    </div>
  )
}
