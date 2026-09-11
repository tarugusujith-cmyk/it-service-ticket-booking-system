interface StatCardProps {
  label: string
  value: number
  tone?: 'default' | 'steel' | 'amber' | 'brick' | 'moss'
}

const toneBar: Record<string, string> = {
  default: 'bg-ink-300 dark:bg-ink-600',
  steel: 'bg-steel-500',
  amber: 'bg-amber-400',
  brick: 'bg-brick-500',
  moss: 'bg-moss-500',
}

export default function StatCard({ label, value, tone = 'default' }: StatCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-4 shadow-card">
      <span className={`h-9 w-1.5 rounded-full ${toneBar[tone]}`} />
      <div>
        <p className="text-2xl font-semibold text-ink-800 dark:text-ink-100">{value}</p>
        <p className="text-xs font-medium text-ink-400 dark:text-ink-400">{label}</p>
      </div>
    </div>
  )
}
