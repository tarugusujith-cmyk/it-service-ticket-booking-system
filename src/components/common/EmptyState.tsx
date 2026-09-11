interface EmptyStateProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-ink-200 dark:border-ink-700 bg-ink-50/50 dark:bg-ink-900/50 px-6 py-14 text-center">
      <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">{title}</p>
      {description && <p className="max-w-sm text-sm text-ink-400 dark:text-ink-400">{description}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
