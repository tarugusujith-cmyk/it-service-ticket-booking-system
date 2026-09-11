import { useState } from 'react'

interface ResolutionFormProps {
  onSubmit: (resolution: string) => void | Promise<void>
  onCancel: () => void
}

export default function ResolutionForm({ onSubmit, onCancel }: ResolutionFormProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit() {
    if (text.trim().length < 10) {
      setError('Resolution notes should be at least 10 characters.')
      return
    }
    setSaving(true)
    try {
      await onSubmit(text.trim())
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-ink-600 dark:text-ink-300">Resolution notes</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder="Describe how the issue was resolved…"
          className="w-full rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm text-ink-700 dark:text-ink-200 focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
        />
        {error && <p className="mt-1 text-xs text-brick-500 dark:text-brick-400">{error}</p>}
      </div>
      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="rounded-md bg-moss-500 px-4 py-2 text-sm font-medium text-white hover:bg-moss-600 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Mark resolved'}
        </button>
      </div>
    </div>
  )
}
