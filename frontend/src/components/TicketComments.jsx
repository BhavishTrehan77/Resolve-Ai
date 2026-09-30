import React, { useState, useEffect } from 'react';
import { Send, Trash2, MessageSquare, User, Clock } from 'lucide-react';
import { commentService } from '../services/commentService';
import { useAuth } from '../context/AuthContext';

export const TicketComments = ({ ticketId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch comments for this ticket
  const loadComments = async () => {
    if (!ticketId) return;
    try {
      setLoading(true);
      setError('');
      const data = await commentService.getCommentsByTicket(ticketId);
      setComments(data || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
      setError('Could not load comments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [ticketId]);

  // Handle comment submit
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const created = await commentService.createComment(ticketId, newComment.trim());
      // Append the comment or reload
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
      setError('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle comment delete
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Could not delete comment.');
    }
  };

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-slate-700">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-brand-400" />
          Activity & Discussion
          <span className="text-xs font-normal text-slate-400 bg-slate-700/60 px-2 py-0.5 rounded-full">
            {comments.length}
          </span>
        </h3>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg">
          {error}
        </div>
      )}

      {/* Comment Form */}
      <form onSubmit={handleAddComment} className="mt-4">
        <div className="relative">
          <textarea
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write an update, question, or diagnostic note..."
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg shadow transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-center py-6 text-slate-400 text-xs flex justify-center items-center gap-2">
            <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            Loading discussion...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No comments yet. Be the first to share an update.
          </div>
        ) : (
          comments.map((comment) => {
            const author = comment.createdBy || {};
            const isAuthor = user?.id === author._id || user?._id === author._id;
            const canDelete = isAuthor || user?.role === 'ADMIN';

            return (
              <div
                key={comment._id}
                className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 transition-all hover:border-slate-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-sm">
                      {author.name ? author.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-200">
                          {author.name || 'Anonymous User'}
                        </span>
                        {author.role && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-brand-300 border border-slate-700">
                            {author.role}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs sm:text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {comment.message}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TicketComments;
