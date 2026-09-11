import { useEffect, useState } from 'react'
import type { Category } from '../../types/category'
import { createCategory, deleteCategory, getCategories, updateCategory } from '../../services/categoryService'
import { useToast } from '../../hooks/useToast'
import CategoryTable from '../../components/Categories/CategoryTable'
import CategoryForm from '../../components/Categories/CategoryForm'
import Modal from '../../components/common/Modal'
import Loader from '../../components/common/Loader'
import ErrorState from '../../components/common/ErrorState'

export default function CategoriesPage() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[] | null>(null)
  const [error, setError] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Category | undefined>()
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  function load() {
    setError('')
    setCategories(null)
    getCategories()
      .then(setCategories)
      .catch((err) => setError(err instanceof Error ? err.message : 'Could not load categories.'))
  }

  useEffect(load, [])

  function openCreate() {
    setEditing(undefined)
    setFormOpen(true)
  }

  function openEdit(category: Category) {
    setEditing(category)
    setFormOpen(true)
  }

  async function handleSubmit(input: Omit<Category, 'id'>) {
    try {
      if (editing) {
        const updated = await updateCategory(editing.id, input)
        setCategories((prev) => prev && prev.map((c) => (c.id === updated.id ? updated : c)))
        showToast('Category updated.')
      } else {
        const created = await createCategory(input)
        setCategories((prev) => (prev ? [...prev, created] : [created]))
        showToast('Category added.')
      }
      setFormOpen(false)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not save category.', 'error')
    }
  }

  async function handleToggleStatus(category: Category) {
    const nextStatus = category.status === 'active' ? 'inactive' : 'active'
    try {
      const updated = await updateCategory(category.id, { status: nextStatus })
      setCategories((prev) => prev && prev.map((c) => (c.id === updated.id ? updated : c)))
      showToast(`${category.name} ${nextStatus === 'active' ? 'activated' : 'deactivated'}.`)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not update status.', 'error')
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    try {
      await deleteCategory(deleteTarget.id)
      setCategories((prev) => prev && prev.filter((c) => c.id !== deleteTarget.id))
      showToast('Category deleted.')
      setDeleteTarget(null)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not delete category.', 'error')
    }
  }

  if (error) return <ErrorState message={error} onRetry={load} />
  if (!categories) return <Loader label="Loading categories…" />

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-800 dark:text-ink-100">Ticket categories</h2>
          <p className="text-sm text-ink-400 dark:text-ink-400">{categories.length} categor{categories.length !== 1 ? 'ies' : 'y'}</p>
        </div>
        <button onClick={openCreate} className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600">
          Add category
        </button>
      </div>

      <CategoryTable categories={categories} onEdit={openEdit} onDelete={setDeleteTarget} onToggleStatus={handleToggleStatus} />

      <Modal title={editing ? 'Edit category' : 'Add category'} isOpen={formOpen} onClose={() => setFormOpen(false)}>
        <CategoryForm initial={editing} onSubmit={handleSubmit} onCancel={() => setFormOpen(false)} />
      </Modal>

      <Modal
        title="Delete category"
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button onClick={() => setDeleteTarget(null)} className="rounded-md border border-ink-200 dark:border-ink-700 px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-900">
              Cancel
            </button>
            <button onClick={handleDelete} className="rounded-md bg-brick-500 px-4 py-2 text-sm font-medium text-white hover:bg-brick-600">
              Delete
            </button>
          </>
        }
      >
        <p className="text-sm text-ink-600 dark:text-ink-300">
          Remove <span className="font-medium">{deleteTarget?.name}</span>? Existing tickets will keep this category name.
        </p>
      </Modal>
    </div>
  )
}
