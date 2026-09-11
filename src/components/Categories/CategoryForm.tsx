import { useState, type FormEvent } from 'react'
import type { Category } from '../../types/category'
import { isRequired, type FieldErrors } from '../../utils/validators'

interface CategoryFormProps {
  initial?: Category
  onSubmit: (input: Omit<Category, 'id'>) => void | Promise<void>
  onCancel: () => void
}

export default function CategoryForm({ initial, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [status, setStatus] = useState<'active' | 'inactive'>(initial?.status ?? 'active')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [saving, setSaving] = useState(false)

  function validate(): boolean {
    const next: FieldErrors = {}
    if (!isRequired(name)) next.name = 'Category name is required.'
    if (!isRequired(description)) next.description = 'Add a short description.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await onSubmit({ name, description, status })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Category name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800" />
        {errors.name && <p className="mt-1 text-xs text-brick-500 dark:text-brick-400">{errors.name}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Description</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800" />
        {errors.description && <p className="mt-1 text-xs text-brick-500 dark:text-brick-400">{errors.description}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'inactive')} className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600 disabled:opacity-60">
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add category'}
        </button>
      </div>
    </form>
  )
}
