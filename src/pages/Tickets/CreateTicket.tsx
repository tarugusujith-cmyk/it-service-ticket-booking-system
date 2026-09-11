import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Category } from '../../types/category'
import type { Ticket, TicketFormInput } from '../../types/ticket'
import { getCategories } from '../../services/categoryService'
import { createTicket, getTickets, nextTicketNumber } from '../../services/ticketService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import TicketForm from '../../components/Tickets/TicketForm'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function CreateTicket() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState('')

  function load() {
    setError('')
    setCategories(null)
    getCategories()
      .then((all) => setCategories(all.filter((c) => c.status === 'active')))
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load categories.'))
  }

  useEffect(load, [])

  async function handleSubmit(input: TicketFormInput) {
    if (!user) return
    try {
      const existing = await getTickets()
      const now = new Date().toISOString()
      const ticket: Omit<Ticket, 'id'> & { id?: string } = {
        ticketNumber: nextTicketNumber(existing),
        subject: input.subject,
        description: input.description,
        createdBy: user.id,
        createdByName: user.fullName,
        assignedAgent: '',
        assignedAgentName: '',
        category: input.category,
        priority: input.priority,
        status: 'Open',
        preferredContact: input.preferredContact,
        createdDate: now,
        updatedDate: now,
        dueDate: '',
        resolution: '',
        resolutionDate: '',
        activity: [{ id: `a${Date.now()}`, timestamp: now, message: `Ticket created by ${user.fullName}` }],
      }
      const created = await createTicket(ticket as Ticket)
      showToast('Ticket created successfully.')
      navigate(`/tickets/${created.id}`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not create ticket.', 'error')
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!categories) return <Loader label="Loading form…" />

  return (
    <div className="max-w-2xl">
      <h2 className="mb-1 text-lg font-semibold text-ink-800 dark:text-ink-100">Create a support ticket</h2>
      <p className="mb-5 text-sm text-ink-400 dark:text-ink-400">Tell us what's going on and we'll route it to the right team.</p>
      <div className="rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 p-5 shadow-card">
        <TicketForm categories={categories} onSubmit={handleSubmit} onCancel={() => navigate(-1)} submitLabel="Submit ticket" />
      </div>
    </div>
  )
}
