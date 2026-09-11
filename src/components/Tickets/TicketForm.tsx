import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/category'
import type { ContactMethod, Priority, TicketFormInput } from '../../types/ticket'
import { isRequired, minLength, type FieldErrors } from '../../utils/validators'

interface TicketFormProps {
  categories: Category[]
  initial?: Partial<TicketFormInput>
  submitLabel?: string
  onSubmit: (input: TicketFormInput) => void | Promise<void>
  onCancel?: () => void
}

const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical']
const contactMethods: ContactMethod[] = ['Email', 'Phone', 'Chat']

export default function TicketForm({ categories, initial, submitLabel = 'Submit ticket', onSubmit, onCancel }: TicketFormProps) {
  const [subject, setSubject] = useState(initial?.subject ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.name ?? '')
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? 'Medium')
  const [preferredContact, setPreferredContact] = useState<ContactMethod>(initial?.preferredContact ?? 'Email')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [submitting, setSubmitting] = useState(false)

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!isRequired(subject)) next.subject = 'Subject is required.'
    if (!minLength(description, 15)) next.description = 'Description should be at least 15 characters.'
    if (!isRequired(category)) next.category = 'Please choose a category.'
    if (!isRequired(priority)) next.priority = 'Please choose a priority.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit({ subject, description, category, priority, preferredContact })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Subject</label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Short summary of the issue"
          className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
        />
        {errors.subject && <p className="mt-1 text-xs text-brick-500 dark:text-brick-400">{errors.subject}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          placeholder="What's happening? Include any steps you've already tried."
          className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
        />
        {errors.description && <p className="mt-1 text-xs text-brick-500 dark:text-brick-400">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-brick-500 dark:text-brick-400">{errors.category}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
          >
            {priorities.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Preferred contact method</label>
        <div className="flex gap-2">
          {contactMethods.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setPreferredContact(m)}
              className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
                preferredContact === m
                  ? 'border-steel-500 dark:border-steel-400 bg-steel-50 dark:bg-steel-900 text-steel-700 dark:text-steel-300'
                  : 'border-ink-200 dark:border-ink-700 text-ink-500 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
