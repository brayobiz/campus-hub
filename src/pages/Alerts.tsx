// src/pages/Alerts.tsx — SENIOR DESIGNER EDITION (2025)
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBell, FaHeart, FaComment, FaShoppingBag, FaCalendarAlt, FaUserPlus, FaStar, FaExclamationCircle, FaSync, FaWifi } from "react-icons/fa";
import BottomNav from "../components/BottomNav";
import { supabase } from "../lib/supabaseClient";
import { useUserStore } from "../store/useUserStore";

type Alert = {
  id: string;
  type: "like" | "comment" | "follow" | "message" | "event" | "system";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  userId: string;
  relatedPostId?: string;
  relatedUserId?: string;
  actionUrl?: string;
};

const Alerts = () => {
  const user = useUserStore((s) => s.user);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ hasError: boolean; message: string; type: 'network' | 'database' | 'unknown' } | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 2;

  useEffect(() => {
    fetchAlerts();

    // Set up realtime subscription for alerts
    const channel = supabase
      .channel('alerts_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'notifications',
        filter: user?.id ? `user_id=eq.${user.id}` : undefined,
      }, (payload: any) => {
        console.log('Alerts realtime update:', payload);
        fetchAlerts(); // Refetch on any change
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchAlerts = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (fetchError) throw fetchError;

      const formattedAlerts: Alert[] = (data || []).map((n: any) => ({
        id: n.id,
        type: n.type || "system",
        title: n.title || "Alert",
        message: n.message || "",
        timestamp: n.created_at,
        read: n.read || false,
        userId: n.user_id,
        relatedPostId: n.related_post_id,
        relatedUserId: n.related_user_id,
        actionUrl: n.action_url,
      }));

      setAlerts(formattedAlerts);
    } catch (err: any) {
      console.error("Error fetching alerts:", err);

      // Determine error type and user-friendly message
      let errorType: 'network' | 'database' | 'unknown' = 'unknown';
      let errorMessage = "Unable to load alerts. Please try again.";

      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorType = 'network';
        errorMessage = "Connection lost. Check your internet and try again.";
      } else if (err.message?.includes('permission') || err.message?.includes('auth')) {
        errorType = 'database';
        errorMessage = "Unable to access your alerts. Please refresh the page.";
      } else if (err.message?.includes('timeout')) {
        errorType = 'network';
        errorMessage = "Request timed out. Please try again.";
      }

      setError({ hasError: true, message: errorMessage, type: errorType });
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      fetchAlerts();
    }
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return "now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "like": return <FaHeart className="text-red-500" />;
      case "comment": return <FaComment className="text-blue-500" />;
      case "follow": return <FaUserPlus className="text-green-500" />;
      case "event": return <FaCalendarAlt className="text-purple-500" />;
      case "message": return <FaBell className="text-orange-500" />;
      default: return <FaStar className="text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white pb-24">
      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-orange-100">
        <div className="px-4 sm:px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900">Alerts</h1>
            <p className="text-orange-600 font-bold text-lg -mt-1">Live updates · {alerts.length} new</p>
          </div>

          {/* Animated Bell */}
          <motion.div
            animate={{ rotate: [0, -20, 20, -20, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 6 }}
            className="relative"
          >
            <FaBell className="text-2xl sm:text-3xl text-orange-500 drop-shadow-lg" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-white animate-pulse" />
          </motion.div>
        </div>
      </header>

      {/* Main Feed */}
      <section className="px-4 sm:px-5 pt-4 sm:pt-6 pb-32">
        {/* Error State */}
        {error?.hasError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-6">
              {error.type === 'network' ? (
                <FaWifi className="w-8 h-8 text-red-500" />
              ) : (
                <FaExclamationCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
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
              className="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Retrying...' : retryCount >= MAX_RETRIES ? 'Max Retries Reached' : 'Try Again'}
            </button>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && alerts.length === 0 && (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
        )}

        {/* Alerts List */}
        {!loading && !error && (
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-20">
                <FaBell className="w-16 h-16 text-gray-300 mx-auto mb-6" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">No alerts yet</h3>
                <p className="text-gray-600">You'll see notifications here when people interact with your posts</p>
              </div>
            ) : (
              alerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  whileTap={{ scale: 0.97 }}
                  className={`bg-white rounded-3xl p-5 shadow-lg border border-gray-100 flex items-center gap-4 ${!alert.read ? 'border-l-4 border-l-orange-500' : ''}`}
                >
                  <div className="p-3 bg-gray-100 rounded-2xl">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg leading-tight">{alert.title}</p>
                    {alert.message && <p className="text-gray-600 text-sm mt-1">{alert.message}</p>}
                    <p className="text-orange-600 font-semibold text-sm mt-1">{formatTime(alert.timestamp)}</p>
                  </div>
                  {!alert.read && <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse" />}
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

export default Alerts;