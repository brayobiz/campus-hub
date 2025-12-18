// src/pages/confessions/ConfessionsFeed.tsx - Production Ready
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BottomNav from "../../components/BottomNav";
import { FaHeart, FaComment, FaSpinner, FaExclamationCircle } from "react-icons/fa";
import { supabase } from "../../lib/supabaseClient";
import { useCampusStore } from "../../store/useCampusStore";
import { useUserStore } from "../../store/useUserStore";

type Confession = {
  id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  created_at: string;
  campus_id: number;
  user_id: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  confession_id: string;
  parent_comment_id?: string | null;
  replies_count?: number;
};

// Helper to format timestamps
const formatTime = (dateStr: string): string => {
  const now = new Date();
  const diff = Math.floor((now.getTime() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString();
};

const ConfessionsFeed = () => {
  const campus = useCampusStore((s) => s.campus);
  const user = useUserStore((s) => s.user);
  const [confessions, setConfessions] = useState<Confession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [openComments, setOpenComments] = useState<string[]>([]);
  const [commentsData, setCommentsData] = useState<{ [key: string]: Comment[] }>({});
  const [openReplies, setOpenReplies] = useState<string[]>([]);

  useEffect(() => {
    fetchConfessions();

    // Set up realtime subscription
    const channel = supabase
      .channel('confessions_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'confessions',
        filter: campus?.id ? `campus_id=eq.${parseInt(campus.id)}` : undefined,
      }, (payload: any) => {
        console.log('Confessions realtime update:', payload);
        fetchConfessions(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [campus?.id]);

  const fetchConfessions = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!campus?.id) {
        setError("Please select a campus first");
        setLoading(false);
        return;
      }

      // Fetch confessions from Supabase
      const { data, error: fetchError } = await supabase
        .from("confessions")
        .select("*")
        .eq("campus_id", parseInt(campus.id))
        .order("created_at", { ascending: false })
        .limit(50);

      if (fetchError) throw fetchError;

      setConfessions(data || []);
    } catch (err) {
      console.error("Error fetching confessions:", err);
      setError("Failed to load confessions");
      setConfessions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (confessionId: string) => {
    if (likedIds.includes(confessionId)) return;
    if (!user?.id) {
      setError("Please login to like confessions");
      return;
    }

    try {
      // Create like record in Supabase
      const { error } = await supabase
        .from("confession_likes")
        .insert([{ confession_id: confessionId, user_id: user.id }]);

      if (error) throw error;

      // Increment like count locally
      setConfessions((prev) =>
        prev.map((c) =>
          c.id === confessionId ? { ...c, likes_count: c.likes_count + 1 } : c
        )
      );
      setLikedIds((prev) => [...prev, confessionId]);
    } catch (err) {
      console.error("Error liking confession:", err);
    }
  };

  const toggleComments = async (confessionId: string) => {
    if (openComments.includes(confessionId)) {
      setOpenComments((prev) => prev.filter((id) => id !== confessionId));
    } else {
      // Fetch comments if not already loaded
      if (!commentsData[confessionId]) {
        try {
          const { data, error } = await supabase
            .from("confession_comments")
            .select("*")
            .eq("confession_id", confessionId)
            .order("created_at", { ascending: true });

          if (error) throw error;
          setCommentsData((prev) => ({ ...prev, [confessionId]: data || [] }));
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      }
      setOpenComments((prev) => [...prev, confessionId]);
    }
  };

  const handleAddComment = async (confessionId: string, content: string) => {
    if (!content.trim()) return;
    if (!user?.id) {
      setError("Please login to comment");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("confession_comments")
        .insert([
          {
            confession_id: confessionId,
            content: content.trim(),
            user_id: user.id,
            parent_comment_id: null,
          },
        ])
        .select();

      if (error) throw error;

      // Update comments locally
      if (data) {
        setCommentsData((prev) => ({
          ...prev,
          [confessionId]: [...(prev[confessionId] || []), ...data],
        }));

        // Increment comment count
        setConfessions((prev) =>
          prev.map((c) =>
            c.id === confessionId
              ? { ...c, comments_count: c.comments_count + 1 }
              : c
          )
        );
      }
    } catch (err) {
      console.error("Error adding comment:", err);
      setError("Failed to add comment");
    }
  };

  const handleAddReply = async (confessionId: string, parentCommentId: string, content: string) => {
    if (!content.trim()) return;
    if (!user?.id) {
      setError("Please login to reply");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("confession_comments")
        .insert([
          {
            confession_id: confessionId,
            content: content.trim(),
            user_id: user.id,
            parent_comment_id: parentCommentId,
          },
        ])
        .select();

      if (error) throw error;

      // Update comments locally
      if (data) {
        setCommentsData((prev) => ({
          ...prev,
          [confessionId]: [...(prev[confessionId] || []), ...data],
        }));
      }
    } catch (err) {
      console.error("Error adding reply:", err);
      setError("Failed to add reply");
    }
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
            <p className="text-xs text-gray-500 mt-1">
              {campus?.name || "Select campus"} • Spill the tea anonymously
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl blur-xl opacity-50" />
        </div>
      </header>

      {/* Feed */}
      <main className="px-5 pt-6 pb-10 space-y-5 max-w-2xl mx-auto">
        {loading ? (
          <div className="text-center py-20">
            <FaSpinner className="text-4xl text-rose-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading confessions...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
            <FaExclamationCircle className="text-3xl text-red-600 mx-auto mb-3" />
            <p className="text-red-900 font-semibold">{error}</p>
          </div>
        ) : confessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🤐</div>
            <p className="text-xl font-bold text-gray-900">No confessions yet</p>
            <p className="text-gray-600 mt-2">Be the first to share something real.</p>
          </div>
        ) : (
          <AnimatePresence>
            {confessions.map((c) => (
              <motion.article
                key={c.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ y: -4 }}
                className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full" />
                      <div>
                        <p className="font-bold text-gray-800">Anonymous</p>
                        <p className="text-xs text-gray-500">{formatTime(c.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="text-gray-800 text-lg leading-relaxed mb-5 break-words">
                    {c.content}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLike(c.id)}
                      disabled={likedIds.includes(c.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                        likedIds.includes(c.id)
                          ? "bg-rose-100 text-rose-600 shadow-md cursor-default"
                          : "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                      }`}
                    >
                      <FaHeart className={likedIds.includes(c.id) ? "fill-rose-600" : ""} />
                      <span>{c.likes_count}</span>
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => toggleComments(c.id)}
                      className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold transition-all ${
                        openComments.includes(c.id)
                          ? "bg-sky-100 text-sky-600 shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-sky-50 hover:text-sky-600"
                      }`}
                    >
                      <FaComment />
                      <span>{c.comments_count}</span>
                    </motion.button>
                  </div>

                  {/* Comments Section */}
                  <AnimatePresence>
                    {openComments.includes(c.id) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-5 border-t border-gray-200"
                      >
                        {commentsData[c.id]?.length > 0 ? (
                          <div className="space-y-3 mb-4">
                            {commentsData[c.id].filter(cm => !cm.parent_comment_id).map((comment) => (
                              <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex gap-3"
                              >
                                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex-shrink-0" />
                                <div className="flex-1">
                                  <div className="bg-gray-50 rounded-2xl px-4 py-3">
                                    <p className="text-sm text-gray-800 font-medium">Anonymous</p>
                                    <p className="text-gray-700 text-sm mt-1 break-words">{comment.content}</p>
                                    <div className="flex items-center gap-3 mt-3">
                                      <p className="text-xs text-gray-500">{formatTime(comment.created_at)}</p>
                                      <button
                                        onClick={() => setOpenReplies(prev => 
                                          prev.includes(comment.id) ? prev.filter(id => id !== comment.id) : [...prev, comment.id]
                                        )}
                                        className="text-xs text-rose-500 hover:text-rose-600 font-semibold"
                                      >
                                        {openReplies.includes(comment.id) ? "Hide" : "Reply"}
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {/* Nested Replies */}
                                  {openReplies.includes(comment.id) && (
                                    <div className="mt-3 ml-6 space-y-3 border-l-2 border-gray-200 pl-4">
                                      {commentsData[c.id]
                                        .filter(cm => cm.parent_comment_id === comment.id)
                                        .map((reply) => (
                                          <motion.div
                                            key={reply.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex gap-2"
                                          >
                                            <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex-shrink-0" />
                                            <div className="bg-blue-50 rounded-xl px-3 py-2 flex-1">
                                              <p className="text-xs text-gray-800 font-medium">Anonymous</p>
                                              <p className="text-gray-700 text-xs mt-0.5 break-words">{reply.content}</p>
                                              <p className="text-xs text-gray-500 mt-1">{formatTime(reply.created_at)}</p>
                                            </div>
                                          </motion.div>
                                        ))}
                                      <AddReplyInput
                                        parentCommentId={comment.id}
                                        onAdd={(text) => handleAddReply(c.id, comment.id, text)}
                                      />
                                    </div>
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm italic text-center py-4">
                            No comments yet. Be the first!
                          </p>
                        )}

                        <AddCommentInput
                          onAdd={(text) => handleAddComment(c.id, text)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </main>

      <BottomNav openPostModal={() => {}} />
    </div>
  );
};

// Enhanced comment input
interface AddCommentInputProps {
  onAdd: (comment: string) => Promise<void>;
}

const AddCommentInput = ({ onAdd }: AddCommentInputProps) => {
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (comment.trim()) {
      setLoading(true);
      await onAdd(comment);
      setComment("");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-5">
      <input
        type="text"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())
        }
        placeholder="Add a comment..."
        disabled={loading}
        className="flex-1 px-5 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-100 outline-none transition-all text-gray-800 placeholder-gray-500 font-medium disabled:opacity-50"
      />

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleSubmit}
        disabled={!comment.trim() || loading}
        className={`p-3 rounded-full transition-all ${
          comment.trim() && !loading
            ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <FaSpinner className="w-5 h-5 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

// Reply input component for nested comments
interface AddReplyInputProps {
  parentCommentId: string;
  onAdd: (reply: string) => Promise<void>;
}

const AddReplyInput = ({ onAdd }: AddReplyInputProps) => {
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (reply.trim()) {
      setLoading(true);
      await onAdd(reply);
      setReply("");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 mt-3">
      <input
        type="text"
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())
        }
        placeholder="Reply anonymously..."
        disabled={loading}
        className="flex-1 px-3 py-2 bg-white rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-2 focus:ring-rose-100 outline-none transition-all text-xs text-gray-800 placeholder-gray-400 disabled:opacity-50"
      />
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={handleSubmit}
        disabled={!reply.trim() || loading}
        className={`p-2 rounded-full transition-all ${
          reply.trim() && !loading
            ? "bg-rose-500 text-white hover:bg-rose-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {loading ? (
          <FaSpinner className="w-4 h-4 animate-spin" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default ConfessionsFeed;