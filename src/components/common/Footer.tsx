export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-ink-100 dark:border-ink-700 bg-white dark:bg-ink-800 px-4 py-4 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center text-xs text-ink-400 dark:text-ink-400 sm:flex-row sm:text-left">
        <p>© {year} DeskFlow Service Desk. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-ink-600 dark:hover:text-ink-300">Help Center</a>
          <a href="#" className="hover:text-ink-600 dark:hover:text-ink-300">Privacy</a>
          <a href="#" className="hover:text-ink-600 dark:hover:text-ink-300">Terms</a>
        </div>
      </div>
    </footer>
  )
}
