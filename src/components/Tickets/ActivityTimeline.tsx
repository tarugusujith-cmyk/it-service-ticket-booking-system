import type { ActivityEntry } from '../../types/ticket'
import { formatDateTime } from '../../utils/dateUtils'

export default function ActivityTimeline({ activity }: { activity: ActivityEntry[] }) {
  if (activity.length === 0) {
    return <p className="text-sm text-ink-400 dark:text-ink-400">No activity recorded yet.</p>
  }

  return (
    <ol className="relative border-l border-ink-200 dark:border-ink-700 pl-4">
      {activity.map((entry) => (
        <li key={entry.id} className="mb-5 last:mb-0">
          <span className="absolute -left-[5px] mt-1.5 h-2.5 w-2.5 rounded-full bg-steel-400 ring-4 ring-white" />
          <p className="text-sm text-ink-700 dark:text-ink-200">{entry.message}</p>
          <p className="text-xs text-ink-400 dark:text-ink-400">{formatDateTime(entry.timestamp)}</p>
        </li>
      ))}
    </ol>
  )
}
