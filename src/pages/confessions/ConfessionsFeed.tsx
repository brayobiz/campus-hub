// src/pages/Confessions/ConfessionsFeed.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import BottomNav from "../../components/BottomNav";
import { FaHeart, FaComment } from "react-icons/fa";

// Helper to format timestamps
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString();
};

// Dummy data
const initialConfessions = [
  { id: 1, user: "Anonymous", content: "I accidentally slept through my exam", likes: 42, comments: ["Relatable", "Been there!", "F in the chat"], created_at: new Date(Date.now() - 3600 * 1000) },
  { id: 2, user: "Anonymous", content: "I secretly love morning lectures.", likes: 8, comments: [], created_at: new Date(Date.now() - 7200 * 1000) },
];

const ConfessionsFeed = () => {
  const [confessions, setConfessions] = useState(initialConfessions);
  const [likedIds, setLikedIds] = useState<number[]>([]);
  const [openComments, setOpenComments] = useState<number[]>([]);

  const handleLike = (id: number) => {
    if (likedIds.includes(id)) return;
    setConfessions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, likes: c.likes + 1 } : c))
    );
    setLikedIds((prev) => [...prev, id]);
  };

  const toggleComments = (id: number) => {
    setOpenComments((prev) =>
      prev.includes(id) ? prev.filter((cId) => cId !== id) : [...prev, id]
    );
  };

  const handleAddComment = (id: number, comment: string) => {
    if (!comment.trim()) return;
    setConfessions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, comments: [...c.comments, comment] } : c
      )
    );
    if (!openComments.includes(id)) setOpenComments((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-purple-50 to-gray-100 pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Confessions
            </h1>
            <p className="text-xs text-gray-500 mt-1">Spill the tea anonymously</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl blur-xl opacity-50" />
        </div>
      </header>

      {/* Feed */}
      <main className="px-5 pt-6 pb-10 space-y-5 max-w-2xl mx-auto">
        {confessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">No confessions yet</div>
            <p className="text-gray-600">Be the first to share something real.</p>
          </div>
        ) : (
          confessions.map((c) => {
            const isLiked = likedIds.includes(c.id);
            const commentsOpen = openComments.includes(c.id);

            return (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full blur-md" />
                      <div>
                        <p className="font-bold text-gray-800">{c.user}</p>
                        <p className="text-xs text-gray-500">{formatTime(c.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-800 text-lg leading-relaxed mb-5">
                    {c.content}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(c.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                        isLiked
                          ? "bg-rose-100 text-rose-600 shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                    >
                      <FaHeart className={isLiked ? "fill-rose-600" : ""} />
                      <span>{c.likes}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComments(c.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                        commentsOpen
                          ? "bg-sky-100 text-sky-600 shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                      }`}
                    >
                      <FaComment />
                      <span>{c.comments.length}</span>
                    </motion.button>
                  </div>

                  {/* Comments */}
                  {commentsOpen && (
                    <div className="mt-6 pt-5 border-t border-gray-200">
                      {c.comments.length > 0 ? (
                        <div className="space-y-3">
                          {c.comments.map((comment, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex gap-3"
                            >
                              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full blur-md flex-shrink-0" />
                              <div className="bg-gray-50 rounded-2xl px-4 py-3 flex-1">
                                <p className="text-sm text-gray-800 font-medium">Anonymous</p>
                                <p className="text-gray-700 text-sm mt-1">{comment}</p>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic text-center py-4">
                          No comments yet. Be the first!
                        </p>
                      )}

                      <AddCommentInput onAdd={(text) => handleAddComment(c.id, text)} />
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })
        )}
      </main>

      <BottomNav />
    </div>
  );
};

// Enhanced comment input
const AddCommentInput = ({ onAdd }: { onAdd: (comment: string) => void }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (comment.trim()) {
      onAdd(comment);
      setComment("");
    }
  };

  return (
    <div className="flex items-center gap-3 mt-5">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())}
        placeholder="Add a comment..."
        className="flex-1 px-5 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium"
      />
      
      {/* Small Send Icon Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSubmit}
        disabled={!comment.trim()}
        className={`p-3 rounded-full transition-all ${
          comment.trim()
            ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      </motion.button>
    </div>
  );
};

export default ConfessionsFeed;