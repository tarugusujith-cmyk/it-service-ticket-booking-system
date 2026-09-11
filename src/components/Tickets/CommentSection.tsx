import { useEffect, useState } from 'react'
import type { Comment } from '../../types/comment'
import { addComment, getCommentsByTicket } from '../../services/commentService'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import Loader from '../common/Loader'

interface CommentSectionProps {
  ticketId: string
  canComment: boolean
  onCommentAdded?: () => void
}

export default function CommentSection({ ticketId, canComment, onCommentAdded }: CommentSectionProps) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [posting, setPosting] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getCommentsByTicket(ticketId)
      .then((data) => active && setComments(data))
      .catch(() => active && showToast('Could not load comments.', 'error'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [ticketId])

  async function handlePost() {
    if (!user || text.trim().length === 0) return
    setPosting(true)
    try {
      const now = new Date()
      const created = await addComment({
        ticketId,
        userId: user.id,
        userName: user.fullName,
        userRole: user.role,
        comment: text.trim(),
        createdDate: now.toISOString().slice(0, 10),
        createdTime: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      })
      setComments((prev) => [...prev, created])
      setText('')
      onCommentAdded?.()
      showToast('Comment added.')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Could not add comment.', 'error')
    } finally {
      setPosting(false)
    }
  }

  if (loading) return <Loader label="Loading comments…" />

  return (
    <div className="space-y-4">
      {comments.length === 0 ? (
        <p className="text-sm text-ink-400 dark:text-ink-400">No comments yet.</p>
      ) : (
        <ul className="space-y-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-md border border-ink-100 dark:border-ink-700 bg-ink-50/50 dark:bg-ink-900/50 p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink-700 dark:text-ink-200">{c.userName}</span>
                <span className="text-xs text-ink-400 dark:text-ink-400">
                  {c.createdDate} · {c.createdTime}
                </span>
              </div>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">{c.comment}</p>
            </li>
          ))}
        </ul>
      )}

      {canComment && (
        <div className="flex gap-2 pt-1">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Add a comment…"
            className="flex-1 rounded-md border border-ink-200 dark:border-ink-700 px-3 py-2 text-sm focus:border-steel-400 dark:focus:border-steel-500 focus:outline-none focus:ring-2 focus:ring-steel-100 dark:focus:ring-steel-800"
            onKeyDown={(e) => e.key === 'Enter' && handlePost()}
          />
          <button
            onClick={handlePost}
            disabled={posting || text.trim().length === 0}
            className="rounded-md bg-steel-500 px-4 py-2 text-sm font-medium text-white hover:bg-steel-600 disabled:opacity-50"
          >
            Post
          </button>
        </div>
      )}
    </div>
  )
}
