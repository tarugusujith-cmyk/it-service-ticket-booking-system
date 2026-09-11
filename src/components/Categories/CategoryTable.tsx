import type { Category } from '../../types/category'
import Badge from '../common/Badge'
import EmptyState from '../common/EmptyState'

interface CategoryTableProps {
  categories: Category[]
  onEdit: (category: Category) => void
  onDelete: (category: Category) => void
  onToggleStatus: (category: Category) => void
}

export default function CategoryTable({ categories, onEdit, onDelete, onToggleStatus }: CategoryTableProps) {
  if (categories.length === 0) {
    return <EmptyState title="No categories yet" description="Add a category so employees can classify their tickets." />
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 shadow-card">
      <table className="min-w-full divide-y divide-ink-100 dark:divide-ink-700 text-sm">
        <thead className="bg-ink-50/60 dark:bg-ink-900/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-400 dark:text-ink-400">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Description</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100 dark:divide-ink-700">
          {categories.map((c) => (
            <tr key={c.id} className="hover:bg-ink-50/40 dark:hover:bg-ink-900/40">
              <td className="whitespace-nowrap px-4 py-3 font-medium text-ink-700 dark:text-ink-200">{c.name}</td>
              <td className="px-4 py-3 text-ink-500 dark:text-ink-400">{c.description}</td>
              <td className="whitespace-nowrap px-4 py-3">
                <Badge label={c.status === 'active' ? 'Active' : 'Inactive'} tone={c.status === 'active' ? 'moss' : 'ink'} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onToggleStatus(c)} className="text-xs font-medium text-steel-600 dark:text-steel-400 hover:underline">
                    {c.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => onEdit(c)} className="text-xs font-medium text-ink-500 dark:text-ink-400 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => onDelete(c)} className="text-xs font-medium text-brick-500 dark:text-brick-400 hover:underline">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
