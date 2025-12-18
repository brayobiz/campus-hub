// src/pages/Explore.tsx — 1 MONTH FREE EDITION (FINAL)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaCrown, FaFire, FaShoppingBag, FaCalendarAlt, FaBookOpen, FaHome, FaStar, FaHeart, FaComment, FaUsers, FaUtensils, FaExclamationCircle, FaSync, FaWifi } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import { supabase } from "../lib/supabaseClient";
import { useCampusStore } from "../store/useCampusStore";

type RecentPost = {
  id: string;
  title: string;
  description?: string;
  price?: number;
  images?: string[];
  created_at: string;
  type: 'marketplace' | 'events' | 'roommates' | 'food' | 'notes' | 'confessions';
  likes_count?: number;
  comments_count?: number;
};

const Explore = () => {
  const campus = useCampusStore((s) => s.campus);
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ hasError: boolean; message: string; type: 'network' | 'database' | 'unknown' } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    fetchRecentPosts();

    // Set up realtime subscriptions for all tables
    const channels = [
      'marketplace', 'events', 'roommates', 'food', 'notes', 'confessions'
    ].map(table =>
      supabase
        .channel(`${table}_explore`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table,
          filter: campus?.id ? `campus_id=eq.${campus.id}` : undefined,
        }, () => {
          console.log(`Explore realtime update from ${table}`);
          fetchRecentPosts();
        })
        .subscribe()
    );

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [campus?.id]);

  const fetchRecentPosts = async () => {
    if (!campus?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch recent posts from all tables
      const [marketplace, events, roommates, food, notes, confessions] = await Promise.all([
        supabase.from('marketplace').select('id, title, description, price, images, created_at').eq('campus_id', campus.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('events').select('id, title, description, banner, created_at').eq('campus_id', campus.id).order('date', { ascending: true }).limit(3),
        supabase.from('roommates').select('id, title, description, image, created_at').eq('campus_id', campus.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('food').select('id, name, description, price, image, created_at').eq('campus_id', campus.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('notes').select('id, title, description, file, created_at').eq('campus_id', campus.id).order('created_at', { ascending: false }).limit(3),
        supabase.from('confessions').select('id, content, likes_count, comments_count, created_at').eq('campus_id', campus.id).order('created_at', { ascending: false }).limit(3),
      ]);

      const allPosts: RecentPost[] = [
        ...((marketplace.data || []).map((p: any) => ({ ...p, type: 'marketplace' as const }))),
        ...((events.data || []).map((p: any) => ({ ...p, title: p.title, description: p.description, images: p.banner ? [p.banner] : undefined, type: 'events' as const }))),
        ...((roommates.data || []).map((p: any) => ({ ...p, images: p.image ? [p.image] : undefined, type: 'roommates' as const }))),
        ...((food.data || []).map((p: any) => ({ ...p, title: p.name, images: p.image ? [p.image] : undefined, type: 'food' as const }))),
        ...((notes.data || []).map((p: any) => ({ ...p, type: 'notes' as const }))),
        ...((confessions.data || []).map((p: any) => ({ ...p, title: 'Anonymous Confession', description: p.content, type: 'confessions' as const, likes_count: p.likes_count, comments_count: p.comments_count }))),
      ];

      // Sort by created_at and take top 12
      const sortedPosts = allPosts
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 12);

      setRecentPosts(sortedPosts);
      setRetryCount(0); // Reset retry count on success
    } catch (err: any) {
      console.error("Error fetching explore posts:", err);

      // Determine error type and user-friendly message
      let errorType: 'network' | 'database' | 'unknown' = 'unknown';
      let errorMessage = "Something went wrong. Please try again.";

      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorType = 'network';
        errorMessage = "Connection lost. Check your internet and try again.";
      } else if (err.message?.includes('permission') || err.message?.includes('auth')) {
        errorType = 'database';
        errorMessage = "Unable to access campus content. Please refresh the page.";
      } else if (err.message?.includes('timeout')) {
        errorType = 'network';
        errorMessage = "Request timed out. Please try again.";
      }

      setError({ hasError: true, message: errorMessage, type: errorType });
      setRecentPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      fetchRecentPosts();
    }
  };

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'marketplace': return <FaShoppingBag className="text-emerald-500" />;
      case 'events': return <FaCalendarAlt className="text-blue-500" />;
      case 'roommates': return <FaUsers className="text-purple-500" />;
      case 'food': return <FaUtensils className="text-orange-500" />;
      case 'notes': return <FaBookOpen className="text-indigo-500" />;
      case 'confessions': return <FaHeart className="text-red-500" />;
      default: return <FaStar className="text-gray-500" />;
    }
  };

  const getPostTypeLabel = (type: string) => {
    switch (type) {
      case 'marketplace': return 'Marketplace';
      case 'events': return 'Event';
      case 'roommates': return 'Roommate';
      case 'food': return 'Food';
      case 'notes': return 'Notes';
      case 'confessions': return 'Confession';
      default: return 'Post';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-2xl border-b border-orange-100">
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Discover</h1>
          <p className="text-orange-600 font-semibold text-sm -mt-1">What's hot on campus today</p>
        </div>
      </header>

      {/* Hero Search */}
      <div className="px-4 sm:px-6 pt-6 sm:pt-8 pb-4 sm:pb-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          <FaSearch className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl sm:text-2xl" />
          <input
            type="text"
            inputMode="search"
            placeholder="Search confessions, food, events..."
            className="w-full pl-12 sm:pl-16 pr-4 sm:pr-8 py-3 sm:py-4 bg-white rounded-3xl shadow-2xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-sm sm:text-lg font-medium min-w-0"
            // Make focusable on mobile so keyboard appears
          />
        </motion.div>
      </div>

      {/* Intro Card */}
      <section className="px-4 sm:px-6">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-3xl sm:rounded-4xl p-6 sm:p-8 border border-orange-200/50 shadow-xl text-center"
        >
          <FaCrown className="text-3xl sm:text-5xl text-orange-500 mx-auto mb-4 drop-shadow-lg" />
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-3">Campus Hub</h2>
          <p className="text-gray-700 text-sm sm:text-lg leading-relaxed max-w-md mx-auto">
            Private app for <span className="font-bold text-orange-600">Kenyan university students only</span>.
            Verified with your <span className="font-bold">.ac.ke</span> email.
          </p>
          <div className="grid grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
            <div><p className="text-2xl sm:text-3xl font-black text-orange-600">50K+</p><p className="text-xs sm:text-sm text-gray-600">Students</p></div>
            <div><p className="text-2xl sm:text-3xl font-black text-orange-600">100%</p><p className="text-xs sm:text-sm text-gray-600">Verified</p></div>
            <div><p className="text-2xl sm:text-3xl font-black text-orange-600">24/7</p><p className="text-xs sm:text-sm text-gray-600">Active</p></div>
          </div>
        </motion.div>
      </section>

      {/* Recent Activity */}
      <section className="px-4 sm:px-6 mt-6 sm:mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg sm:text-xl font-black">Recent Activity</h3>
          <p className="text-xs sm:text-sm text-gray-500">Live updates</p>
        </div>

        {/* Error State */}
        {error?.hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
              {error.type === 'network' ? (
                <FaWifi className="w-8 h-8 text-red-500" />
              ) : (
                <FaExclamationCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              {error.type === 'network' ? 'Connection Issue' : 'Something went wrong'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">{error.message}</p>
            {retryCount < MAX_RETRIES && (
              <p className="text-xs text-gray-500 mb-4">
                Attempt {retryCount + 1} of {MAX_RETRIES + 1}
              </p>
            )}
            <button
              onClick={handleRetry}
              disabled={loading || retryCount >= MAX_RETRIES}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Retrying...' : retryCount >= MAX_RETRIES ? 'Max Retries Reached' : 'Try Again'}
            </button>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && recentPosts.length === 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-md border animate-pulse">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        )}

        {/* Recent Posts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentPosts.length === 0 ? (
              <div className="col-span-full text-center py-10">
                <FaFire className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No recent activity yet</p>
              </div>
            ) : (
              recentPosts.map((post, i) => (
                <motion.div
                  key={`${post.type}-${post.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getPostIcon(post.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        {getPostTypeLabel(post.type)}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2">
                    {post.title}
                  </h4>

                  {post.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {post.description}
                    </p>
                  )}

                  {post.price && (
                    <p className="font-bold text-orange-600 text-sm">
                      KSh {post.price.toLocaleString()}
                    </p>
                  )}

                  {post.type === 'confessions' && (
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-2">
                      {post.likes_count && (
                        <div className="flex items-center gap-1">
                          <FaHeart className="text-red-500" />
                          <span>{post.likes_count}</span>
                        </div>
                      )}
                      {post.comments_count && (
                        <div className="flex items-center gap-1">
                          <FaComment className="text-blue-500" />
                          <span>{post.comments_count}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {post.images && post.images[0] && (
                    <div className="mt-3">
                      <img
                        src={post.images[0]}
                        alt={post.title}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </section>

      <BottomNav />
    </div>
  );
};

export default Explore;