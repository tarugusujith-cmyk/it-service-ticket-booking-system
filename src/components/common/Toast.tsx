import { useToast } from '../../hooks/useToast'
import type { ToastKind } from '../../context/ToastContext'

const kindClasses: Record<ToastKind, string> = {
  success: 'border-moss-400 dark:border-moss-500 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200',
  error: 'border-brick-400 dark:border-brick-500 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200',
  info: 'border-steel-400 dark:border-steel-500 bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200',
}

const kindDot: Record<ToastKind, string> = {
  success: 'bg-moss-500',
  error: 'bg-brick-500',
  info: 'bg-steel-500',
}

export default function ToastViewport() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-start gap-2.5 rounded-lg border-l-4 px-4 py-3 shadow-card ${kindClasses[t.kind]}`}
        >
          <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${kindDot[t.kind]}`} />
          <p className="flex-1 text-sm leading-snug">{t.message}</p>
          <button onClick={() => dismissToast(t.id)} className="text-ink-300 dark:text-ink-600 hover:text-ink-500 dark:hover:text-ink-400">
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
