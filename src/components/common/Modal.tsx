import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }

export default function Modal({ title, isOpen, onClose, children, footer, size = 'md' }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink-900/40 dark:bg-black/60" onClick={onClose} />
      <div className={`relative w-full ${sizeMap[size]} rounded-xl bg-white dark:bg-ink-800 shadow-xl`}>
        <div className="flex items-center justify-between border-b border-ink-100 dark:border-ink-700 px-5 py-4">
          <h3 className="text-base font-semibold text-ink-800 dark:text-ink-100">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-ink-400 dark:text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-900 hover:text-ink-700 dark:hover:text-ink-200"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-ink-100 dark:border-ink-700 px-5 py-4">{footer}</div>}
      </div>
    </div>
  )
}
